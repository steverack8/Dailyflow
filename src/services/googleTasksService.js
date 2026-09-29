const GSI_SRC = "https://accounts.google.com/gsi/client"
const TASKS_SCOPE = "https://www.googleapis.com/auth/tasks"
const EMAIL_SCOPE =
  "https://www.googleapis.com/auth/userinfo.email"
const USERINFO_URL =
  "https://www.googleapis.com/oauth2/v2/userinfo"
const TASKS_API = "https://www.googleapis.com/tasks/v1"
const TASK_LIST_TITLE = "DailyFlow"
const DONE_MARKER = "Sumber: DailyFlow"

let gsiLoader = null

function loadGoogleIdentityServices() {
  if (
    typeof window !== "undefined" &&
    window.google?.accounts?.oauth2
  ) {
    return Promise.resolve()
  }

  if (gsiLoader) {
    return gsiLoader
  }

  gsiLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${GSI_SRC}"]`
    )

    if (existing) {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () =>
        reject(
          new Error(
            "Gagal memuat Google Identity Services."
          )
        )
      )
      return
    }

    const script = document.createElement("script")

    script.src = GSI_SRC
    script.async = true
    script.defer = true

    script.onload = () => resolve()
    script.onerror = () => {
      gsiLoader = null
      reject(
        new Error(
          "Gagal memuat Google Identity Services."
        )
      )
    }

    document.head.appendChild(script)
  })

  return gsiLoader
}

export function getGoogleTasksClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || ""
}

const CONNECTION_STORAGE_KEY =
  "dailyflow_google_tasks_connection"

const TOKEN_CACHE_KEY =
  "dailyflow_google_tasks_token"

function readCachedToken(uid) {
  if (!uid) {
    return null
  }

  try {
    const raw = sessionStorage.getItem(TOKEN_CACHE_KEY)

    if (!raw) {
      return null
    }

    const cached = JSON.parse(raw)

    if (
      cached?.uid !== uid ||
      !cached.token?.accessToken ||
      !cached.token?.expiresAt ||
      cached.token.expiresAt <= Date.now() + 30000
    ) {
      return null
    }

    return cached.token
  } catch (error) {
    console.warn(
      "Failed to read Google Tasks token cache:",
      error
    )

    return null
  }
}

function writeCachedToken(uid, token) {
  if (!uid || !token?.accessToken) {
    return
  }

  try {
    sessionStorage.setItem(
      TOKEN_CACHE_KEY,
      JSON.stringify({ uid, token })
    )
  } catch (error) {
    console.warn(
      "Failed to cache Google Tasks token:",
      error
    )
  }
}

export function getSavedGoogleTasksConnection(uid) {
  if (!uid) {
    return null
  }

  try {
    const raw =
      localStorage.getItem(CONNECTION_STORAGE_KEY)

    if (!raw) {
      return null
    }

    const saved = JSON.parse(raw)

    if (saved?.uid !== uid) {
      return null
    }

    return saved
  } catch (error) {
    console.warn(
      "Failed to read Google Tasks connection:",
      error
    )

    return null
  }
}

export function saveGoogleTasksConnection(
  uid,
  email
) {
  if (!uid) {
    return
  }

  try {
    localStorage.setItem(
      CONNECTION_STORAGE_KEY,
      JSON.stringify({
        uid,
        email: email || "",
        connectedAt: Date.now(),
      })
    )
  } catch (error) {
    console.warn(
      "Failed to save Google Tasks connection:",
      error
    )
  }
}

function requestAccessToken(clientId, scope, loginHint) {
  return new Promise((resolve, reject) => {
    const tokenClient =
      window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope,
        login_hint: loginHint || undefined,
        callback: (response) => {
          if (response?.error) {
            reject(new Error(response.error))
            return
          }

          resolve({
            accessToken: response.access_token,
            expiresAt:
              Date.now() +
              Number(response.expires_in || 3600) *
                1000,
          })
        },
        error_callback: (error) => {
          reject(
            new Error(
              error?.message ||
                "Otorisasi Google dibatalkan."
            )
          )
        },
      })

    tokenClient.requestAccessToken({
      prompt: "",
    })
  })
}

async function fetchAccountEmail(accessToken) {
  try {
    const response = await fetch(USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    return data.email || null
  } catch (emailError) {
    console.warn(
      "Failed to fetch Google account email:",
      emailError
    )

    return null
  }
}

export async function requestGoogleTasksToken({
  loginHint,
  uid,
} = {}) {
  const cachedToken = readCachedToken(uid)

  if (cachedToken) {
    return cachedToken
  }

  const clientId = getGoogleTasksClientId()

  if (!clientId) {
    throw new Error(
      "Fitur sinkron Google Tasks belum aktif."
    )
  }

  await loadGoogleIdentityServices()

  const hint = loginHint || ""

  let token

  try {
    token = await requestAccessToken(
      clientId,
      `${TASKS_SCOPE} ${EMAIL_SCOPE}`,
      hint
    )
  } catch (scopeError) {
    const message = String(
      scopeError?.message || ""
    ).toLowerCase()

    if (!message.includes("scope")) {
      throw scopeError
    }

    console.warn(
      "Email scope ditolak, ulangi tanpa email:",
      scopeError
    )

    token = await requestAccessToken(
      clientId,
      TASKS_SCOPE,
      hint
    )
  }

  token.email = await fetchAccountEmail(
    token.accessToken
  )

  if (
    hint &&
    token.email &&
    token.email.toLowerCase() !== hint.toLowerCase()
  ) {
    throw new Error(
      `Sinkronisasi harus memakai akun ${hint}.`
    )
  }

  writeCachedToken(uid, token)

  return token
}

async function tasksRequest(token, url, options = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  }

  if (options.body) {
    headers["Content-Type"] = "application/json"
  }

  let response

  try {
    response = await fetch(url, {
      ...options,
      headers,
    })
  } catch (fetchError) {
    console.error(
      "Google Tasks request blocked:",
      url,
      fetchError
    )

    throw new Error(
      "Tidak dapat terhubung ke Google Tasks. Coba lagi nanti.",
      { cause: fetchError }
    )
  }

  if (!response.ok) {
    const details = await response.text()

    console.error(
      "Google Tasks request failed:",
      url,
      details
    )

    if (response.status === 401) {
      throw new Error("Sesi Google kedaluwarsa.")
    }

    const error = new Error(
      "Gagal menghubungi Google Tasks. Coba lagi nanti."
    )

    error.status = response.status

    throw error
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

async function ensureTaskList(token) {
  const lists = await tasksRequest(
    token,
    `${TASKS_API}/users/@me/lists?maxResults=100`
  )

  const existing = (lists.items || []).find(
    (item) => item.title === TASK_LIST_TITLE
  )

  if (existing) {
    return existing
  }

  return tasksRequest(
    token,
    `${TASKS_API}/users/@me/lists`,
    {
      method: "POST",
      body: JSON.stringify({ title: TASK_LIST_TITLE }),
    }
  )
}

async function clearPreviousSync(token, taskListId) {
  const query = new URLSearchParams({
    maxResults: "100",
    showCompleted: "true",
    showHidden: "true",
    showDeleted: "false",
  })

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const response = await tasksRequest(
      token,
      `${TASKS_API}/lists/${taskListId}/tasks?${query.toString()}`
    )

    const dailyFlowTaskIds = (response.items || [])
      .filter(
        (task) =>
          !task.deleted &&
          String(task.notes || "").includes(DONE_MARKER)
      )
      .map((task) => task.id)

    if (dailyFlowTaskIds.length === 0) {
      return
    }

    for (const taskId of dailyFlowTaskIds) {
      try {
        await tasksRequest(
          token,
          `${TASKS_API}/lists/${taskListId}/tasks/${taskId}`,
          { method: "DELETE" }
        )
      } catch (deleteError) {
        if (deleteError?.status !== 404) {
          throw deleteError
        }
      }
    }
  }
}

function addDays(date, amount) {
  const [year, month, day] = String(date)
    .split("-")
    .map(Number)

  const target = new Date(
    Date.UTC(year, month - 1, day + amount)
  )

  return target.toISOString().slice(0, 10)
}

async function countSyncedTasks(token, taskListId) {
  const query = new URLSearchParams({
    maxResults: "100",
    showCompleted: "true",
    showHidden: "true",
    showDeleted: "false",
  })

  let pageToken = ""
  let count = 0

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const pageQuery = new URLSearchParams(query)

    if (pageToken) {
      pageQuery.set("pageToken", pageToken)
    }

    const response = await tasksRequest(
      token,
      `${TASKS_API}/lists/${taskListId}/tasks?${pageQuery.toString()}`
    )

    count += (response.items || []).filter(
      (task) =>
        !task.deleted &&
        String(task.notes || "").includes(DONE_MARKER)
    ).length

    pageToken = response.nextPageToken || ""

    if (!pageToken) {
      break
    }
  }

  return count
}

export async function syncScheduleToGoogleTasks({
  token,
  activities,
  date,
  days = 1,
  onProgress,
}) {
  if (!token) {
    throw new Error(
      "Hubungkan akun Google terlebih dahulu."
    )
  }

  if (!activities?.length) {
    throw new Error(
      "Belum ada aktivitas untuk disinkronkan."
    )
  }

  const taskList = await ensureTaskList(token)

  await clearPreviousSync(token, taskList.id)

  const ordered = [...activities].sort((a, b) =>
    String(a.startTime).localeCompare(
      String(b.startTime)
    )
  )

  const dayCount = Math.max(
    1,
    Math.min(90, Number(days) || 1)
  )

  let created = 0

  const total = ordered.length * dayCount

  onProgress?.(0, total)

  let previousTaskId = null

  for (let dayOffset = 0; dayOffset < dayCount; dayOffset += 1) {
    const dueDate = addDays(date, dayOffset)

    for (const activity of ordered) {
      const title = `${activity.startTime} - ${activity.endTime} | ${activity.title}`.slice(
        0,
        900
      )

      const notes = [
        activity.description || "",
        DONE_MARKER,
      ]
        .filter(Boolean)
        .join("\n")

      onProgress?.(created + 1, total)

      const previousQuery = previousTaskId
        ? `?previous=${encodeURIComponent(previousTaskId)}`
        : ""

      const inserted = await tasksRequest(
        token,
        `${TASKS_API}/lists/${taskList.id}/tasks${previousQuery}`,
        {
          method: "POST",
          body: JSON.stringify({
            title,
            notes,
            status: "needsAction",
            due: `${dueDate}T00:00:00.000Z`,
          }),
        }
      )

      previousTaskId = inserted?.id || previousTaskId

      created += 1
    }
  }

  const verified = await countSyncedTasks(
    token,
    taskList.id
  )

  return {
    created,
    verified,
    listTitle: taskList.title,
    days: dayCount,
  }
}
