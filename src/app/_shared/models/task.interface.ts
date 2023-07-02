import { Employee } from "./employee.model";

interface ITask {
  id?: string;
  title?: string;
  type?: string;
  startDate?: Date;
  date?: string;
  endDate?: Date;
  description?: string;
  employee?: Employee[];


}
  
interface ITaskTypeOption {
  type: string;
}


export { ITask, ITaskTypeOption };
