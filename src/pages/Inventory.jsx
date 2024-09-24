import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Card, Tabs, Form, Input, Button, Select, Spin, Modal } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useDeleteInventoryMutation, useGetDonationsListQuery, useGetInventoryQuery, useGetSingleInventoryQuery, usePostInventoryMutation, useUpdateSingleInventoryMutation } from '../redux/api/baseApi';

const { TabPane } = Tabs;


const Inventory = () => {
  const user = useSelector((state) => state.user);
  // States
  const [editId, setEditId] = useState(undefined);
  const [deleteId, setDeleteId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  
  // Querys
  const { data: getDonationsList, isLoading: getDonationsListLoading } = useGetDonationsListQuery(undefined);
  const { data: getSingleInventory, isLoading: singleInventoryLoading } = useGetSingleInventoryQuery(editId);
  const { data: getInventory, isLoading: getInventoryLoading } = useGetInventoryQuery();
  
  // Mutations
  const [postInventory, { isLoading: postInventoryLoading }] = usePostInventoryMutation();
  const [deleteInventory, { isLoading: deleteInventoryLoading }] = useDeleteInventoryMutation();
  const [updateSingleInventory, { isLoading: updateSingleInventoryLoading }] = useUpdateSingleInventoryMutation();
<<<<<<< HEAD
 
  // Loader
 if (postInventoryLoading || getInventoryLoading || deleteInventoryLoading || singleInventoryLoading
    || updateSingleInventoryLoading || getDonationsListLoading) {
=======
  const { data: getSingleInventory, isLoading: singleInventoryLoading } = useGetSingleInventoryQuery(editId);

 if (postInventoryLoading || getInventoryLoading || deleteInventoryLoading || singleInventoryLoading
    || updateSingleInventoryLoading || getDonationsLoading || getDonationsListLoading || getDonationsReportLoading) {
>>>>>>> 6b390e8fcf79f52507ce2e5071d55686a44a5de2
    return <Spin />;
  }

  const colums_donors = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Type',
      dataIndex: 'relief_type',
      key: 'relief_type',
      render: type => (
        <Tag color={type === 'Relief' ? 'green' : 'blue'}>
          {type}
        </Tag>
      ),
    }
  ]

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Type',
      dataIndex: 'expense_type',
      key: 'type',
      render: type => (
        <Tag color={type === 'Relief' ? 'green' : 'blue'}>
          {type}
        </Tag>
      ),
    },
    {
      title: user?.user?.role === 'Admin' && 'Action',
      key: 'action',
      render: (text, record) => (
        user?.user?.role === 'Admin' && (
          <Space size="middle">
            <>
              <a onClick={() => handleEditThis(record.id)}>Edit</a>
              <a onClick={() => handleShow(record.id)}>Delete</a>
            </>
          </Space>
        )
      )
    }

  ];

  const handleShow = (id) => {
    setDeleteId(id);
    showLoading();
  }

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
    console.log(values)
    await postInventory(values);
  };

  const handleDeleteThis = async (id) => {
    await deleteInventory(id);
    setOpen(false);
  }

  const handleEditThis = async (id) => {
    setEditId(id);
    showLoadingTwo();
  }


  const handleUpdateEdit = async (id) => {
    try {
      const payload = {
        name: updatedName ? updatedName : getSingleInventory[0]?.name,
        quantity: updatedQuantity ? updatedQuantity : getSingleInventory[0]?.quantity,
        price: updatedPrice ? updatedPrice : getSingleInventory[0]?.price
      }
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
    window.open('https://dmm-backend-lmtx.onrender.com/api/csv-donation', '_blank');
  };
  const handleDownloadInvenotoryReport = () => {
    window.open('https://dmm-backend-lmtx.onrender.com/api/csv-inventory', '_blank');
  }
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Inventory List" key="1">
          {
            user?.user?.role === 'Admin' && (
              <>
                <Button
                  style={{ backgroundColor: 'blue', color: '' }}
                  type="primary"
                  icon={<DownloadOutlined />} className='mb-4'
                  onClick={handleDownloadInvenotoryReport}
                >
                  Daily Inventory Report
                </Button>
              </>
            )
          }
          <Card>
            <Table  scroll={{ x: "max-content" }} columns={columns} dataSource={getInventory} />
          </Card>
          <div className='mt-12'></div>
          {
            user?.user?.role === 'Admin' && (<>
              <Button
                style={{ backgroundColor: 'green', borderColor: 'green' }}
                type="primary"
                icon={<DownloadOutlined />}
                className='mb-4'
                onClick={handleDownload}
              >
                Daily Donation Report
              </Button>
            </>)
          }
          <Card>
            <Table  scroll={{ x: "max-content" }} columns={colums_donors} dataSource={getDonationsList} />
          </Card>
          <Modal
            title={<p>Delete Inventory Item</p>}
            footer={false}
            loading={loading}
            open={open}
            onCancel={() => setOpen(false)}
          >
            <p>So, you wanna delete this items?</p>
            <div className='flex items-center gap-2 mt-2'>
              <Button danger type="primary" onClick={() => handleDeleteThis(deleteId)}>Yes</Button>
              <Button type='primary' onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </Modal>
          <Modal
            title={<p>Edit Inventory Item</p>}
            footer={false}
            loading={loading}
            open={openTwo}
            onCancel={() => setOpenTwo(false)}
          >
            <p>So, you wanna delete this items?</p>
            <div className=''>
              <h1>Name</h1>
              <Input onChange={(e) => setUpdatedName(e.target.value)} defaultValue={getSingleInventory && getSingleInventory[0]?.name} />
              <h1>Quantity</h1>
              <Input onChange={(e) => setUpdatedQuantity(e.target.value)} defaultValue={getSingleInventory && getSingleInventory[0]?.quantity} />
              <h1>Price</h1>
              <Input onChange={(e) => setUpdatedPrice(e.target.value)} defaultValue={getSingleInventory && getSingleInventory[0]?.price} />
              <div className='mt-4 gap-2 flex'>
                <Button danger type="primary" onClick={() => handleUpdateEdit(getSingleInventory && getSingleInventory[0]?.id)}>Yes</Button>
                <Button type='primary' onClick={() => setOpenTwo(false)}>Cancel</Button>
              </div>
            </div>
          </Modal>

        </TabPane>
        {
          user?.role === 'Admin' || 'Volunteer' && (
            <TabPane tab="Add Item" key="2">
              <Card>
                <Form
                  name="inventory"
                  onFinish={onFinish}
                  layout="vertical"
                >
                  <Form.Item
                    name="name"
                    label="Item Name"
                    rules={[{ required: true, message: 'Please input the item name!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: 'Please input the quantity!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please select the price!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                      Add Item
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </TabPane>
          )
        }
      </Tabs>
    </div>
  );
};

export default Inventory;
