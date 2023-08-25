export interface PasswordService {
  createHash(value: string): Promise<string>;

  compare(value: string, encrypted: string): Promise<boolean>;
}
