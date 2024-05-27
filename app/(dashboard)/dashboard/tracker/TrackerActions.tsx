import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TrackerActions = ({
    trackerId,
    setTrackerId,
    onSubmit,
}: {
    trackerId: string;
    setTrackerId: (arg: string) => void;
    onSubmit: () => void;
}) => {
    return (
        <div className="flex justify-start gap-3 mb-4">
            <Input
                onChange={(e) => setTrackerId(e.target.value)}
                value={trackerId}
                className="w-[400px]"
                placeholder="BL Number, Booking Number, Consignee, Vessel"
            />
            <Button
                type="button"
                onClick={onSubmit}
                className="w-[100px] bg-[#4b99b7] hover:bg-[#58A7C6] border-2 border-[#367c97] shadow-lg"
            >
                Track
            </Button>
        </div>
    );
};

export default TrackerActions;
