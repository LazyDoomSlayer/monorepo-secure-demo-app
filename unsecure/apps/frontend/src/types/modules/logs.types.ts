/**
 * Represents one row from /logs, matching LogResponseDto on the server.
 */
export interface ILogResponse<> {
  /** UUID of the log entry */
  id: string
  /** Severity level */
  level: 'log' | 'error' | 'warn' | 'debug' | 'verbose'
  /** Context or source, e.g. "TasksService" */
  context: string
  /** Human-readable message */
  message: string
  /** Optional structured payload */
  meta?: Record<string, unknown>
  /** ISO-8601 timestamp string from the server */
  timestamp: string
}

/**
 * Wrapper returned by GET /logs
 */
export interface IGetLogsResponse {
  total: number
  items: ILogResponse[]
}
