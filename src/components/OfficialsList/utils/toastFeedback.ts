import { toast } from "react-toastify";

export const toastFeedback = (uid, isAssigned, officialsOrSupervisors) => {
        if (isAssigned) {
            toast.success(
                `${officialsOrSupervisors[uid].firstName} ${officialsOrSupervisors[uid].lastName} replaced ${isAssigned.name}`,
            );
        } else if (
            officialsOrSupervisors[uid].firstName === 'No' &&
            officialsOrSupervisors[uid].lastName === 'Supervisor'
        ) {
            toast.success(`Game has no supervisor.`);
        } else {
            toast.success(
                `${officialsOrSupervisors[uid].firstName} ${officialsOrSupervisors[uid].lastName} added to queue.`,
            );
        }
};