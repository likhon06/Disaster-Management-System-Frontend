import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Select,
  Spin,
  Modal,
} from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  useDeleteInventoryMutation,
  useGetDonationsListQuery,
  useGetInventoryQuery,
  useGetSingleInventoryQuery,
  usePostInventoryMutation,
  useUpdateSingleInventoryMutation,
} from "../redux/api/baseApi";

const { TabPane } = Tabs;

const Inventory = () => {
  // States
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openTwo, setOpenTwo] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const user = useSelector((state) => state.user);
  const [editId, setEditId] = useState(undefined);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedQuantity, setUpdatedQuantity] = useState("");

  // Querys
  const { data: getDonationsList, isLoading: getDonationsListLoading } =
    useGetDonationsListQuery(undefined);
  const { data: getSingleInventory, isLoading: singleInventoryLoading } =
    useGetSingleInventoryQuery(editId);
  const { data: getInventory, isLoading: getInventoryLoading } =
    useGetInventoryQuery();

  // Mutations
  const [postInventory, { isLoading: postInventoryLoading }] =
    usePostInventoryMutation();
  const [deleteInventory, { isLoading: deleteInventoryLoading }] =
    useDeleteInventoryMutation();
  const [updateSingleInventory, { isLoading: updateSingleInventoryLoading }] =
    useUpdateSingleInventoryMutation();

  // Loader
  if (
    postInventoryLoading ||
    getInventoryLoading ||
    deleteInventoryLoading ||
    singleInventoryLoading ||
    updateSingleInventoryLoading ||
    getDonationsListLoading
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading data, please wait..." size="large" vertical={true} />
      </div>
    );
  }

  const colums_donors = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Type",
      dataIndex: "relief_type",
      key: "relief_type",
      render: (type) => (
        <Tag color={type === "Relief" ? "green" : "blue"}>{type}</Tag>
      ),
    },
  ];

  const columns = [
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Type",
      dataIndex: "expense_type",
      key: "type",
      render: (type) => (
        <Tag color={type === "Relief" ? "green" : "blue"}>{type}</Tag>
      ),
    },
    {
      title: user?.user?.role === "Admin" && "Action",
      key: "action",
      render: (text, record) =>
        user?.user?.role === "Admin" && (
          <Space size="middle">
            <>
              <a onClick={() => handleEditThis(record.id)}>Edit</a>
              <a onClick={() => handleShow(record.id)}>Delete</a>
            </>
          </Space>
        ),
    },
  ];

  const handleShow = (id) => {
    setDeleteId(id);
    showLoading();
  };

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const showLoadingTwo = () => {
    setOpenTwo(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const onFinish = async (values) => {
    console.log(values);
    await postInventory(values);
  };

  const handleDeleteThis = async (id) => {
    await deleteInventory(id);
    setOpen(false);
  };

  const handleEditThis = async (id) => {
    setEditId(id);
    showLoadingTwo();
  };

  const handleUpdateEdit = async (id) => {
    try {
      const payload = {
        name: updatedName ? updatedName : getSingleInventory[0]?.name,
        quantity: updatedQuantity
          ? updatedQuantity
          : getSingleInventory[0]?.quantity,
        price: updatedPrice ? updatedPrice : getSingleInventory[0]?.price,
      };
      console.log({ id, payload });
      setLoading(true);
      await updateSingleInventory({ id, payload });
      setLoading(false);
      setOpenTwo(false);
    } catch (error) {
      console.error("Update failed:", error);
      // Optionally show a user-friendly message
    }
  };

  const handleDownload = () => {
    window.open("https://dmm-backend.vercel.app/api/csv-donation", "_blank");
  };

  const handleDownloadInvenotoryReport = () => {
    window.open("https://dmm-backend.vercel.app/api/csv-inventory", "_blank");
  };

  return (
    <div className="mt-8 mb-8 lg:mt-20 lg:mb-20 px-4">
      <Tabs defaultActiveKey="1" className="w-full">
        <TabPane tab="Inventory List" key="1">
          <div className="space-y-4">
            {(user?.user?.role === "Admin" ||
              user?.user?.role === "Volunteer") && (
              <Button
                style={{ backgroundColor: "blue", color: "" }}
                type="primary"
                icon={<DownloadOutlined />}
                className="mb-4 w-full sm:w-auto"
                onClick={handleDownloadInvenotoryReport}
              >
                Daily Inventory Report
              </Button>
            )}
            <Card className="w-full">
              <div className="overflow-x-auto">
                <Table
                  scroll={{ x: "max-content" }}
                  columns={columns}
                  dataSource={getInventory}
                />
              </div>
            </Card>

            <div className="mt-8"></div>

            {user?.user?.role === "Admin" && (
              <Button
                style={{ backgroundColor: "green", borderColor: "green" }}
                type="primary"
                icon={<DownloadOutlined />}
                className="mb-4 w-full sm:w-auto"
                onClick={handleDownload}
              >
                Daily Donation Report
              </Button>
            )}
            <Card className="w-full">
              <div className="overflow-x-auto">
                <Table
                  scroll={{ x: "max-content" }}
                  columns={colums_donors}
                  dataSource={getDonationsList}
                />
              </div>
            </Card>
          </div>

          <Modal
            title={<p>Delete Inventory Item</p>}
            footer={false}
            loading={loading}
            open={open}
            onCancel={() => setOpen(false)}
            width="90vw"
            maxWidth={400}
          >
            <p>So, you wanna delete this items?</p>
            <div className="flex items-center gap-2 mt-4">
              <Button
                danger
                type="primary"
                onClick={() => handleDeleteThis(deleteId)}
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                type="primary"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Modal>

          <Modal
            title={<p>Edit Inventory Item</p>}
            footer={false}
            loading={loading}
            open={openTwo}
            onCancel={() => setOpenTwo(false)}
            width="90vw"
            maxWidth={500}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Name</h3>
                <Input
                  onChange={(e) => setUpdatedName(e.target.value)}
                  defaultValue={
                    getSingleInventory && getSingleInventory[0]?.name
                  }
                  className="w-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                <Input
                  onChange={(e) => setUpdatedQuantity(e.target.value)}
                  defaultValue={
                    getSingleInventory && getSingleInventory[0]?.quantity
                  }
                  className="w-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Price</h3>
                <Input
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  defaultValue={
                    getSingleInventory && getSingleInventory[0]?.price
                  }
                  className="w-full"
                />
              </div>
              <div className="mt-4 gap-2 flex">
                <Button
                  danger
                  type="primary"
                  onClick={() =>
                    handleUpdateEdit(
                      getSingleInventory && getSingleInventory[0]?.id
                    )
                  }
                  className="flex-1"
                >
                  Update
                </Button>
                <Button
                  type="primary"
                  onClick={() => setOpenTwo(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </TabPane>

        {["Admin", "Volunteer"].includes(user?.user?.role) && (
          <TabPane tab="Add Item" key="2">
            <Card className="w-full max-w-2xl mx-auto">
              <Form name="inventory" onFinish={onFinish} layout="vertical">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Form.Item
                    name="name"
                    label="Item Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the item name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[
                      { required: true, message: "Please input the quantity!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <Form.Item
                  name="price"
                  label="Price"
                  rules={[
                    { required: true, message: "Please select the price!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    className="w-full sm:w-auto"
                  >
                    Add Item
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default Inventory;
