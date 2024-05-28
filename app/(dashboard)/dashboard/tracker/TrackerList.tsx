import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-tables";
import { locationColumns } from "./LocationColumns";

const TrackerList = ({ containers }: { containers: any }) => {
    return (
        <div className="flex flex-col md:flex-row justify-center gap-10">
            {containers.map((con, index) => {
                return (
                    <Card
                        className="lg:mb-5 shadow-md last:mb-5 w-full md:w-[50%] lg:w-[30%]"
                        key={index}
                    >
                        <CardContent className="p-5 flex flex-col gap-5">
                            <div className="h-full">
                                <div className="flex gap-5 mb-2">
                                    <div>
                                        <h2 className="font-semibold">
                                            Truck No.
                                        </h2>
                                        <p>{con.truck_no}</p>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">
                                            Containers
                                        </h2>
                                        <p>
                                            {con.bl_containers
                                                .split(",")
                                                .join(", ")}
                                        </p>
                                    </div>
                                </div>
                                <DataTable
                                    data={con.location}
                                    columns={locationColumns}
                                    pagination={false}
                                />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default TrackerList;
