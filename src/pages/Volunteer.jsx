import React, { useState } from 'react';
import { Table, Tag, Space, Card, Spin, Input } from 'antd';
import { useSelector } from 'react-redux';
import { useGetVolunteerQuery, useUpdateVolunteerMutation } from '../redux/api/baseApi';
import { Button, Modal } from 'antd';
const Volunteer = () => {
  const user = useSelector((state) => state.user.user)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: getVolunteer, isLoading: volunteerLoading } = useGetVolunteerQuery(undefined);
  const [updateVolunteer, { isLoading: updateVolunteerLoading }] = useUpdateVolunteerMutation(undefined);
  console.log('VOLUNTEER', getVolunteer);
  console.log('ROLE', user?.role);
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Assigned Task',
      key: 'task',
      dataIndex: 'task',
      render: (_, record) => (
        <Tag color='green'>
          {record.assigntask}
        </Tag>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      dataIndex: 'location',
      render: (_, record) => (
        <Tag color='green'>
          {record.location}
        </Tag>
      ),
    },

    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {
            user?.role === 'Admin' && (
              <>
                <a onClick={() => handleShowModal(record.id)}>Assign Task</a>
              </>
            )
          }
        </Space>
      ),
    },


  ];

  const handleShowModal = (id) => {
    setId(id);
    showLoading();
  }

  const showLoading = () => {
    setIsModalOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await updateVolunteer({ id, data: { task, taskLocation } });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <div className='mt-20 mb-20'>
      <Card title="Available Volunteers">
        <Modal loading={loading} title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <h1>Assign Task</h1>
          <Input onChange={(e) => setTask(e.target.value)} placeholder="Basic usage" />
          <h1 className='mt-2'>Assign Location</h1>
          <Input onChange={(e) => setTaskLocation(e.target.value)} placeholder="Basic usage" />
        </Modal>
        <Table  scroll={{ x: "max-content" }} columns={columns} dataSource={getVolunteer} />
      </Card>
    </div>
  );
};

export default Volunteer;