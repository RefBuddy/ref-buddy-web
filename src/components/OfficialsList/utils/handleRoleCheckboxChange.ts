export const handleRoleCheckboxChange = (e, role, officialsData, setOfficialsData, setShowSaveButton) => {
        const originalRefereeState = false;
        const originalLinesmanState = false;
        
        if (!officialsData) return;
        // Directly updating the officialsData's role
        const updatedRole = { ...officialsData?.role, [role]: e.target.checked };
        const updatedOfficialsData = { ...officialsData, role: updatedRole };

        setOfficialsData(updatedOfficialsData);

        // Check if the state differs from the original state for either checkbox
        if (
            (role === 'Referee' && e.target.checked !== originalRefereeState) ||
            (role === 'Linesman' && e.target.checked !== originalLinesmanState)
        ) {
            setShowSaveButton(true);
        } else {
            setShowSaveButton(
                updatedOfficialsData.role.Referee !== originalRefereeState ||
                    updatedOfficialsData.role.Linesman !== originalLinesmanState,
            );
        }
};