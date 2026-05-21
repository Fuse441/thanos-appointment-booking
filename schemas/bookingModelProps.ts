import { IAppointment, IAppointmentType } from "./appointment";
import { IDoctor } from "./doctor";

export interface IBookingModalProps {
  initialDate: string;
  initialDoctors?: IDoctor[];
  initialTypes?: IAppointmentType[];
  onClose: () => void;
  onConfirm: (appt: IAppointment) => void;
}
