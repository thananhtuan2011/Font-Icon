import * as Sentry from '@sentry/angular-ivy';
import { BrowserOptions } from '@sentry/angular-ivy';

export interface ISentryConfig extends BrowserOptions {
    isDebug: any;
    isEnable: any;
    /**
     * Url call to sentry project
     */
    dsn: string;
    /**
     * Show popup user feedback, default is false
     */
    showDialog?: boolean;
    replaysSessionSampleRate?: number; //The sample rate for session-long replays. 1.0 will record all sessions and 0 will record none.
    replaysOnErrorSampleRate?: number; //The sample rate for sessions that has had an error occur. This is independent of sessionSampleRate. 1.0 will record all sessions and 0 will record none.
}

export interface ITransaction extends Sentry.Transaction {}

export interface ISpan extends Sentry.Span {}

export interface IInitTransaction extends ISpanContext {
    /**
     * Human-readable identifier for the transaction
     */
    name: string;
    /**
     * If true, sets the end timestamp of the transaction to the highest timestamp of child spans, trimming
     * the duration of the transaction. This is useful to discard extra time in the transaction that is not
     * accounted for in child spans, like what happens in the idle transaction Tracing integration, where we finish the
     * transaction after a given "idle time" and we don't want this "idle time" to be part of the transaction.
     */
    trimEnd?: boolean;
    /**
     * If this transaction has a parent, the parent's sampling decision
     */
    parentSampled?: boolean;
    /**
     * Metadata associated with the transaction, for internal SDK use.
     */
    metadata?: Partial<any>;
}

export interface IMonitoring {
    inprogress: boolean;
    // finish: boolean;
    transaction: ITransaction;
    currentSpan: ISpan | null;
}

export type IInitSpan = Pick<ISpanContext, Exclude<keyof ISpanContext, 'sampled' | 'traceId' | 'parentSpanId'>>;

export interface ISpanContext {
    /**
     * Description of the Span.
     */
    description?: string;
    /**
     * Operation of the Span.
     */
    op?: string;
    /**
     * Completion status of the Span.
     * See: {@sentry/tracing SpanStatus} for possible values
     */
    status?: string;
    /**
     * Parent Span ID
     */
    parentSpanId?: string;
    /**
     * Was this span chosen to be sent as part of the sample?
     */
    sampled?: boolean;
    /**
     * Span ID
     */
    spanId?: string;
    /**
     * Trace ID
     */
    traceId?: string;
    /**
     * Tags of the Span.
     */
    tags?: {
        [key: string]: Primitive;
    };
    /**
     * Data of the Span.
     */
    data?: {
        [key: string]: any;
    };
    /**
     * Timestamp in seconds (epoch time) indicating when the span started.
     */
    startTimestamp?: number;
    /**
     * Timestamp in seconds (epoch time) indicating when the span ended.
     */
    endTimestamp?: number;
    /**
     * The instrumenter that created this span.
     */
    instrumenter?: Instrumenter;
}

export enum SpanStatus {
    /** The operation completed successfully. */
    Ok = 'ok',
    /** Deadline expired before operation could complete. */
    DeadlineExceeded = 'deadline_exceeded',
    /** 401 Unauthorized (actually does mean unauthenticated according to RFC 7235) */
    Unauthenticated = 'unauthenticated',
    /** 403 Forbidden */
    PermissionDenied = 'permission_denied',
    /** 404 Not Found. Some requested entity (file or directory) was not found. */
    NotFound = 'not_found',
    /** 429 Too Many Requests */
    ResourceExhausted = 'resource_exhausted',
    /** Client specified an invalid argument. 4xx. */
    InvalidArgument = 'invalid_argument',
    /** 501 Not Implemented */
    Unimplemented = 'unimplemented',
    /** 503 Service Unavailable */
    Unavailable = 'unavailable',
    /** Other/generic 5xx. */
    InternalError = 'internal_error',
    /** Unknown. Any non-standard HTTP status code. */
    UnknownError = 'unknown_error',
    /** The operation was cancelled (typically by the user). */
    Cancelled = 'cancelled',
    /** Already exists (409) */
    AlreadyExists = 'already_exists',
    /** Operation was rejected because the system is not in a state required for the operation's */
    FailedPrecondition = 'failed_precondition',
    /** The operation was aborted, typically due to a concurrency issue. */
    Aborted = 'aborted',
    /** Operation was attempted past the valid range. */
    OutOfRange = 'out_of_range',
    /** Unrecoverable data loss or corruption */
    DataLoss = 'data_loss'
}

type Primitive = number | string | boolean | bigint | symbol | null | undefined;
type Instrumenter = 'sentry' | 'otel';
