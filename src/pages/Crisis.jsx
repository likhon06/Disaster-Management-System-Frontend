import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Card, Table, Tag, Space, Spin, message, Upload, Modal, Carousel, Dropdown } from 'antd';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useDeleteSingleCrisisMutation, useGetCrisisQuery, useGetSingleCrisisQuery, usePostCrisisMutation, useStatusUpdateMutation } from '../redux/api/baseApi';
const { Option } = Select;
const { TextArea } = Input;
import Axios from 'axios'
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
const { Dragger } = Upload;

const Crisis = () => {
  const user = useSelector((state) => state.user);
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: severity => (
        <Tag color={severity === 'High' ? 'red' : severity === 'Medium' ? 'orange' : 'green'}>
          {severity}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewSingleCrisis(record.id)}>View</a>
          {
            user?.user?.role === 'Admin' && (
              <>
                <a onClick={() => handleViewSingleCrisisDelete(record.id)}>Delete</a>
              </>
            )
          }
        </Space>
      ),
    },
  ];


  const [file, setFile] = useState([]);
  const [singleCrisisId, setSingleCrisisId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postCrisis, { isLoading: postCrisisLoading }] = usePostCrisisMutation(undefined);
  const { data: crisisData, isLoading: crisisLoading } = useGetCrisisQuery(undefined);
  const [deleteSingleCrisis, { isLoading: deleteSingleCrisisLoading }] = useDeleteSingleCrisisMutation(undefined);
  const [statusUpdate, { isLoading: statusUpdateLoading }] = useStatusUpdateMutation(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { data: singleCrisisData, isLoading: singleCrisisLoading } = useGetSingleCrisisQuery(singleCrisisId, {
    skip: !singleCrisisId
  });

  useEffect(() => {
    if (singleCrisisId && !singleCrisisLoading && singleCrisisData) {
      console.log(singleCrisisData);
    }
  }, [singleCrisisId, singleCrisisLoading, singleCrisisData]);

  if (postCrisisLoading || isLoading || crisisLoading || (singleCrisisLoading && singleCrisisId) || statusUpdateLoading || deleteSingleCrisisLoading) return <Spin />;

  const handleViewSingleCrisis = (id) => {
    setSingleCrisisId(id);
    showLoading();
  }

  const handleViewSingleCrisisDelete = async (id) => {
    await deleteSingleCrisis(id);
    toast.success('Crisis deleted successfully');
  }
  const showLoading = () => {
    setIsModalOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };


  const onFinish = async (values) => {
    console.log(values);
    const uploadPromises = file.map(async (f) => {
      const formData = new FormData();
      formData.append('file', f.originFileObj);
      formData.append('upload_preset', 'kkjmubyy');
      const response = await Axios.post('https://api.cloudinary.com/v1_1/dba3vyqox/image/upload', formData);
      setIsLoading(true);
      if (response) {
        setIsLoading(false);
        return response;
      }
    });
    try {
      const responses = await Promise.all(uploadPromises);
      setIsLoading(true);
      if (responses) {
        setIsLoading(false);
      }
      const imageArray = responses.map((res) => res.data.secure_url);
      console.log(imageArray);
      const modifiedCrisisData = {
        ...values, images: imageArray
      }
      console.log(modifiedCrisisData);
      const res = await postCrisis(modifiedCrisisData);
      setIsLoading(true);
      if (res) {
        setIsLoading(false);
      }
      toast.success(`${values.title} crisis added successfully`);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };



  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const props = {
    name: 'file',
    multiple: true,
    onChange(info) {
      setFile(info.fileList);
    },
    onDrop(e) {
      setFile(e.dataTransfer.files[0]);
    },
  };
  const handleChange = async (value) => {
    console.log(value);
    try {
      await statusUpdate({ id: singleCrisisData[0]?.id, value });
      // Don't close the modal automatically
      setIsModalOpen(false);
      message.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update status');
    }
  };

  return (
    <div className='mt-12 mb-12'>
      <Card title="Active Crises" className=''>
        <Table columns={columns} dataSource={crisisData} />
      </Card>
      <Modal loading={loading} width={1400} title="Crisis Details" key={singleCrisisData && singleCrisisData[0]?.id} open={isModalOpen} footer={false} onCancel={handleCancel}>
        <Carousel className='w-full' autoplay>
          {
            singleCrisisData && singleCrisisData[0]?.image?.map((img) => (
              <img className='' src={img} alt="" />
            ))
          }
        </Carousel>
        <div className="bg-white rounded-lg  my-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{singleCrisisData && singleCrisisData[0]?.title}</h1>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-semibold text-lg text-gray-600 w-32">Location:</span>
              <h2 className="text-xl text-gray-700">{singleCrisisData && singleCrisisData[0]?.location}</h2>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-lg text-gray-600 w-32">Severity:</span>

              {
                singleCrisisData && singleCrisisData[0]?.severity === 'High' && (<>
                  <Tag color="error" >High</Tag>
                </>)
              }
              {
                singleCrisisData && singleCrisisData[0]?.severity === 'Medium' && (<>
                  <Tag color="warning">Medium</Tag>
                </>)
              }
              {
                singleCrisisData && singleCrisisData[0]?.severity === 'Low' && (<>
                  <Tag color="blue">Low</Tag>
                </>)
              }
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-lg text-gray-600 w-32">Help Needed:</span>
              <h2 className="text-xl text-gray-700">{singleCrisisData && singleCrisisData[0]?.required_help}</h2>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-lg text-gray-600 w-32">Description:</span>
              <p className="text-lg text-gray-700">{singleCrisisData && singleCrisisData[0]?.description}</p>
            </div>
            <div className="flex items-center">
              {
                user?.user?.role === 'Admin' && (
                  <>
                    <Space wrap>
                      <Select
                        defaultValue={singleCrisisData && singleCrisisData[0]?.status}
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                          { value: 'Active', label: 'Active' },
                          { value: 'Pending', label: 'Pending' },
                        ]}
                      />
                    </Space>
                  </>
                )
              }
            </div>
          </div>
        </div>

      </Modal>
      <Card title="Add New Crisis" className="mt-6">
        <Form
          name="crisis"
          onFinish={onFinish}
          layout="vertical"
        >
          <p className='mb-2'>Upload Files or Images</p>


          <Dragger {...props} className=''>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or multiple files
              banned files.
            </p>
          </Dragger>


          <Form.Item
            name="title"
            label="Title" className='mt-4'
            rules={[{ required: true, message: 'Please input the crisis title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please input the location!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="severity"
            label="Severity"
            rules={[{ required: true, message: 'Please select the severity!' }]}
          >
            <Select>
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="requiredHelp"
            label="Required Help"
            rules={[{ required: true, message: 'Please input the required help!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Add Crisis
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Crisis;