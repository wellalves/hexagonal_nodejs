
export class Tuition {
  constructor(
    public id: string,
    public studentId: string,
    public amount: number,
    public dueDate: Date
  ) {}
}
