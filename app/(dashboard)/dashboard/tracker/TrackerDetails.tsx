"use client";

import { BASE_URL } from "@/lib/constants";
import Link from "next/link";

const TrackerDetails = (data: { data: any }) => {
    const dataItem = data.data;

    const clrFilesArray = dataItem.clr_attachment?.split(",");
    const shipmentFilesArray = dataItem.shipment_attachment?.split(",");

    return (
        <div className="flex flex-col md:flex-row md:justify-center gap-1 bg-white p-3 md:p-5 xl:mx-44 shadow-md rounded-lg">
            <div className="flex flex-col gap-1 w-[400px]">
                <p>
                    <span className="font-semibold">BL: </span>
                    {dataItem.bl}
                </p>
                <p>
                    <span className="font-semibold">Book No.: </span>
                    {dataItem.book_no}
                </p>
                <p>
                    <span className="font-semibold">Consignee: </span>
                    {dataItem.consignee}
                </p>
                <p>
                    <span className="font-semibold">Docs: </span>
                    {dataItem.docs}
                </p>
                <p>
                    <span className="font-semibold">FPOD: </span>
                    {dataItem.final_port_of_destination}
                </p>
                <div>
                    <span className="font-semibold">CLR Attachments: </span>
                    {clrFilesArray
                        ? clrFilesArray.map((file: string, index: number) => {
                              return (
                                  <Link
                                      key={index+1}
                                      href={`${BASE_URL}/attachments/${file}`}
                                      target="_blank"
                                  >
                                      {index === clrFilesArray.length - 1 ? (
                                          <span>Attachment {index + 1}</span>
                                      ) : (
                                          <span>Attachment {index + 1}, </span>
                                      )}
                                  </Link>
                              );
                          })
                        : "None"}
                </div>
            </div>
            <div className="flex flex-col gap-1 w-[400px]">
                <p>
                    <span className="font-semibold">No. of Containers: </span>
                    {dataItem.no_container}
                </p>
                <p>
                    <span className="font-semibold">POD: </span>
                    {dataItem.port_of_departure}
                </p>
                <p>
                    <span className="font-semibold">POL: </span>
                    {dataItem.port_of_loading}
                </p>
                <p>
                    <span className="font-semibold">ETD: </span>
                    {dataItem.etd}
                </p>
                <p>
                    <span className="font-semibold">ETA Karachi: </span>
                    {dataItem.eta_karachi}
                </p>
                <div>
                    <span className="font-semibold">
                        Shipment Attachments:{" "}
                    </span>
                    {shipmentFilesArray
                        ? shipmentFilesArray.map(
                              (file: string, index: number) => {
                                  return (
                                      <Link
                                          key={index+1}
                                          href={`${BASE_URL}/attachments/${file}`}
                                          target="_blank"
                                      >
                                          {index ===
                                          shipmentFilesArray.length - 1 ? (
                                              <span>
                                                  Attachment {index + 1}
                                              </span>
                                          ) : (
                                              <span>
                                                  Attachment {index + 1},{" "}
                                              </span>
                                          )}
                                      </Link>
                                  );
                              }
                          )
                        : "None"}
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <p>
                    <span className="font-semibold">Product: </span>
                    {dataItem.product}
                </p>
                <p>
                    <span className="font-semibold">Shipper: </span>
                    {dataItem.shipper}
                </p>
                <p>
                    <span className="font-semibold">Surrender: </span>
                    {dataItem.surrender}
                </p>
                <p>
                    <span className="font-semibold">Vessel : </span>
                    {dataItem.vessel}
                </p>
                <p>
                    <span className="font-semibold">Shipment Status : </span>
                    {dataItem.shipment_comment}
                </p>
            </div>
        </div>
    );
};

export default TrackerDetails;
