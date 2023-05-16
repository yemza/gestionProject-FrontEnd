import { Employee } from "./employee.model";

interface ITask {
  id?: string | number;
  title?: string;
  type?: string;
  startDate?: Date;
  date?: string;
  endDate?: Date;
  description?: string;
  employee?: Employee[];
 // ghdalaid: number;


}
  


interface ITaskTypeOption {
  type: string;
}
interface ITypePercentage {
  count: number;
  type: string;
}

export { ITask, ITaskTypeOption, ITypePercentage };
