import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-tables";
import { locationColumns } from "./LocationColumns";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";

const TrackerList = ({ containers }: { containers: any }) => {
    return (
        <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-10">
            {containers.map((con, index) => {
                const portFilesArray =
                    con.port_attachment !== ""
                        ? con.port_attachment?.split(",")
                        : null;

                return (
                    <Card
                        className="lg:mb-5 shadow-md last:mb-5 w-full md:w-[50%] lg:w-[45%]"
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
                                    <div>
                                        <h2 className="font-semibold">
                                            Port Attachments
                                        </h2>
                                        {portFilesArray
                                            ? portFilesArray.map(
                                                  (
                                                      file: string,
                                                      index: number
                                                  ) => {
                                                      return (
                                                          <Link
                                                              href={`${BASE_URL}/attachments/${file}`}
                                                              target="_blank"
                                                          >
                                                              {index ===
                                                              portFilesArray.length -
                                                                  1 ? (
                                                                  <span>
                                                                      Attachment{" "}
                                                                      {index +
                                                                          1}
                                                                  </span>
                                                              ) : (
                                                                  <span>
                                                                      Attachment{" "}
                                                                      {index +
                                                                          1}
                                                                      ,{" "}
                                                                  </span>
                                                              )}
                                                          </Link>
                                                      );
                                                  }
                                              )
                                            : "None"}
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
