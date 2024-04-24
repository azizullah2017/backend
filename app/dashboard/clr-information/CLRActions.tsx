import TableFilter from "@/components/TableFilter";
import { Button } from "@/components/ui/button";

const CLRActions = ({
    setIsShowing,
    setData,
}: {
    setIsShowing: () => void;
    setData: () => void;
}) => {
    return (
        <div className="flex justify-between w-full">
            <TableFilter setData={setData} />
            <Button
                className="bg-[#11047A] hover:bg-[#422AFB]"
                onClick={() => setIsShowing((isShowing) => !isShowing)}
            >
                Add Record
            </Button>
        </div>
    );
};

export default CLRActions;
