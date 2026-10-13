export class SubmissionLimitError extends Error {
  constructor(public readonly retryAfter: number) {
    super("Submission limit reached");
    this.name = "SubmissionLimitError";
  }
}
