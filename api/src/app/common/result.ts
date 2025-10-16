export class Result {
  success: boolean;
  messages: ResultMessage[];

  constructor(success: boolean = false, messages: ResultMessage[] = []) {
    this.success = success;
    this.messages = messages || [];
  }

  get failure(): boolean {
    return !this.success;
  }

  get summaryMessage(): string {
    return this.messages.length ? this.messages.map((msg) => `${msg.type}: ${msg.content}`).join('\n') : '';
  }

  get infoMessages(): ResultMessage[] {
    return this.messages.filter((msg) => msg.type === MessageTypeEnum.Info);
  }

  get warningMessages(): ResultMessage[] {
    return this.messages.filter((msg) => msg.type === MessageTypeEnum.Warning);
  }

  get errorMessages(): ResultMessage[] {
    return this.messages.filter((msg) => msg.type === MessageTypeEnum.Error);
  }

  get exceptionMessages(): ResultMessage[] {
    return this.messages.filter((msg) => msg.type === MessageTypeEnum.Exception);
  }

  static ok(...messages: ResultMessage[]): Result {
    return new Result(true, messages);
  }

  static okWithPayload<T>(payload: T, ...messages: ResultMessage[]): ObjectResult<T> {
    return new ObjectResult(payload, true, null, messages);
  }

  static okWithMetaData<T>(payload: T, metaData: PagingMetaData, ...messages: ResultMessage[]): ObjectResult<T> {
    return new ObjectResult(payload, true, metaData, messages);
  }

  static fail(...messages: ResultMessage[]): Result {
    return new Result(false, messages);
  }

  static failWithPayload<T>(payload: T, ...messages: ResultMessage[]): ObjectResult<T> {
    return new ObjectResult(payload, false, null, messages);
  }

  static failWithMetaData<T>(payload: T, metaData: PagingMetaData, ...messages: ResultMessage[]): ObjectResult<T> {
    return new ObjectResult(payload, false, metaData, messages);
  }

  static create(messages: ResultMessage[] = []): Result {
    const hasErrors = messages.some((msg) => msg.type === MessageTypeEnum.Error || msg.type === MessageTypeEnum.Exception);
    return new Result(!hasErrors, messages);
  }

  static createWithPayload<T>(payload: T, messages: ResultMessage[] = []): ObjectResult<T> {
    const hasErrors = messages.some((msg) => msg.type === MessageTypeEnum.Error || msg.type === MessageTypeEnum.Exception);
    return new ObjectResult(payload, !hasErrors, null, messages);
  }

  static createWithMetaData<T>(payload: T, metaData: PagingMetaData, messages: ResultMessage[] = []): ObjectResult<T> {
    const hasErrors = messages.some((msg) => msg.type === MessageTypeEnum.Error || msg.type === MessageTypeEnum.Exception);
    return new ObjectResult(payload, !hasErrors, metaData, messages);
  }
}

export class ObjectResult<T> extends Result {
  payload: T | null;
  metaData: PagingMetaData | null;

  constructor(payload: T | null = null, success: boolean = false, metaData: PagingMetaData | null = null, messages: ResultMessage[] = []) {
    super(success, messages);
    this.payload = payload;
    this.metaData = metaData;
  }
}

export class PagingMetaData {
  total: number;
  offset: number;
  limit: number;

  constructor(total: number, offset: number, limit: number) {
    this.total = total;
    this.offset = offset;
    this.limit = limit;
  }
}

export class ResultMessage {
  type: MessageTypeEnum;
  content: string;
  context: any;
  isVisible: boolean;

  constructor(type: MessageTypeEnum, content: string, context: any = null, isVisible: boolean = true) {
    this.type = type;
    this.content = content;
    this.context = context;
    this.isVisible = isVisible;
  }

  static create(type: MessageTypeEnum, message: string, context: any = null, isVisible: boolean = true): ResultMessage {
    return new ResultMessage(type, message, context, isVisible);
  }

  static info(message: string, context: any = null, isVisible: boolean = true): ResultMessage {
    return new ResultMessage(MessageTypeEnum.Info, message, context, isVisible);
  }

  static warning(message: string, context: any = null, isVisible: boolean = true): ResultMessage {
    return new ResultMessage(MessageTypeEnum.Warning, message, context, isVisible);
  }

  static error(message: string, context: any = null, isVisible: boolean = true): ResultMessage {
    return new ResultMessage(MessageTypeEnum.Error, message, context, isVisible);
  }

  static exception(exception: Error & { innerException?: Error }, context: any = null, isVisible: boolean = true): ResultMessage {
    let message = exception.message;
    if (exception.innerException) {
      message += `\nInnerException: ${exception.innerException.message}`;
    }
    return new ResultMessage(MessageTypeEnum.Exception, message, context, isVisible);
  }
}

export enum MessageTypeEnum {
  Info = 1,
  Warning = 2,
  Error = 3,
  Exception = 4,
  Success = 5
}
