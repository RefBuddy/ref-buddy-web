import React, { useState } from "react";
import { Button } from "../../../Button";
import * as Utils from "../../utils";

const UpdateRoleCheckboxGroup = ({ official, officialsData, setOfficialsData, officialsOrSupervisors, currentLeague, dispatch }) => {
    const [showSaveButton, setShowSaveButton] = useState(false);

    return (
        <div className="h-auto flex-shrink-0 ml-64 mt-2">
            <div className="mt-2 flex flex-row gap-3">
                <div className="flex flex-row gap-1 items-center">
                    <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                        checked={officialsData?.role?.Referee || false}
                        onChange={(e) =>
                            Utils.handleRoleCheckboxChange(
                                e,
                                'Referee',
                                officialsData,
                                setOfficialsData,
                                setShowSaveButton,
                            )
                        }
                    />

                    <label className="text-xs font-medium text-black">
                        R
                    </label>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                        checked={officialsData?.role?.Linesman || false}
                        onChange={(e) =>
                            Utils.handleRoleCheckboxChange(
                                e,
                                'Linesman',
                                officialsData,
                                setOfficialsData,
                                setShowSaveButton,
                            )
                        }
                    />

                    <label className="text-xs font-medium text-black">
                        L
                    </label>
                </div>
            </div>
            {showSaveButton && (
                <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md mt-2 ml-1 text-xs"
                    onClick={() => {
                        Utils.updateUserRole(
                            official.uid,
                            officialsData,
                            officialsOrSupervisors,
                            currentLeague,
                            dispatch,
                            setOfficialsData,
                        );
                    }}
                >
                    Save
                </Button>
            )}
        </div>
    );
};

export default UpdateRoleCheckboxGroup;