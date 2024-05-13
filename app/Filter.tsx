import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Filter = ({ setFilter }: { setFilter: (arg: string) => void }) => {
    return (
        <div>
            <Select onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue
                        placeholder="Apply Filter"
                        defaultValue="monthly"
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="bi-annual">Bi Annual</SelectItem>
                    <SelectItem value="overall">Overall</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default Filter;
