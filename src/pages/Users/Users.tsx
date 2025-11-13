import React, { useState } from "react";
import TableNew from "../../components/TableNew";
import Modal from "../../components/Modal";
import ExportButtons from "../../components/ExportButton";
import FilterButtons from "../../components/FilterButtons";
import UserRegistrationForm from "./UserRegistrationForm";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../utils/http";
import { URL } from "../../utils/urls";

const Users = () => {
  const [openModal, setOpenModal] = useState(false);

  const groupedColumns = [
    {
      label: "Name",
      accesor: "display_name",
      className: "",
    },
    {
      label: "Email",
      accesor: "email",
      className: "",
    },
    {
      label: "Phone No",
      accesor: "phone",
      className: "",
    },
    {
      label: "Role",
      accesor: "role",
      className: "",
    },
  ];

  const getUsers = async () => {
    const res = await Api.get({ url: URL.users });
    return res?.data?.data;
  };

  const getRole = async () => {
    const res = await Api.get({ url: URL.role });

    return res?.data?.data;
  };

  const { data: allRoles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRole,
  });

  const { data: allUsers, isLoading: userLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const rows = [
    {
      bearing_no: "DE",
      ry: 2.1,
      rb: 2.3,
      yb: 2.0,
      ph_to_ph: "550 MΩ",
      ph_to_e: "480 MΩ",
    },
    {
      bearing_no: "NDE",
      ry: 2.2,
      rb: 2.5,
      yb: 2.1,
      ph_to_ph: "600 MΩ",
      ph_to_e: "500 MΩ",
    },
  ];

  return (
    <div className="w-full overflow-auto">
      <div className="md:flex grid p-4 w-full">
        <div className="col-span-1">
          <h3 className="font-bold text-2xl text-gray-700 whitespace-nowrap">
            All Users
          </h3>
        </div>
        <div className="w-full col-span-1 md:flex items-center justify-between gap-2">
          <div className="w-fit  ml-auto flex gap-1  ">
            
          </div> 
          <div className="flex md:w-fit md:mt-0 mt-2 justify-end w-full gap-2 ">
            <ExportButtons />
            <FilterButtons options={[{label : "All" , value : 'all'} , ...((allRoles ?? [])?.map((item : any) =>  ({  label : item?.role , value : item?.id })))]} />
            <button
              className="w-fit px-4 bg-blue-500 text-white p-2 rounded-sm font-semibold  cursor-pointer hover:bg-blue-600"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Add user
            </button>
          </div>
        </div>
      </div>
      <TableNew
      ischildren={false}
        groupedColumns={groupedColumns}
        totalCount={allUsers?.length ? allUsers?.length : 0}
        isLoading={userLoading}
        rows={allUsers}
        cb={({ page, rowsPerPage }) => {
          console.log(page, rowsPerPage);
        }}
      />
      <Modal
        isOpen={openModal}
        title="User Registration"
        setIsOpen={setOpenModal}
      >
        <UserRegistrationForm  setOpenModal={setOpenModal}  allRoles={allRoles?.length > 0 ? allRoles : []} />
      </Modal>
    </div>
  );
};

export default Users;
