
export class CustomError extends Error {
    fromService: string;
    
    constructor(message: string, fromService: string) {
      super(message);
      this.fromService = fromService;
      this.name = "ValidationError";
    }
}