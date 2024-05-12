import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DeleteAlert = ({
    dialogIsOpen,
    setDialogIsOpen,
    deleteRow,
}: {
    dialogIsOpen: boolean;
    setDialogIsOpen: (arg: boolean) => void;
    deleteRow: () => void;
}) => {
    return (
        <AlertDialog open={dialogIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Alert!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the row?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDialogIsOpen(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => {
                            const dlt = await deleteRow();
                            setDialogIsOpen(false);
                        }}
                    >
                        OK
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAlert;
