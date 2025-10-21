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
    accept: 'image/*,.pdf,.doc,.docx',
    beforeUpload: () => false, // Prevent auto upload
    onChange(info) {
      console.log('File change:', info.fileList);
      setFile(info.fileList);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    showUploadList: false, // We'll handle the file list display ourselves
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
    <div className='mt-8 mb-8 lg:mt-12 lg:mb-12 px-4'>
      <Card title="Active Crises" className='w-full'>
        <div className="overflow-x-auto">
          <Table scroll={{ x: "max-content" }} columns={columns} dataSource={crisisData} />
        </div>
      </Card>
      
      {/* 
        To fix the "Modal opening double time" issue after clicking "View", 
        make sure you do not set a dynamic key on the Modal. 
        React will unmount and remount the Modal when the key changes, 
        which can result in double opening or flickering behavior. 
        Remove the `key` prop from the Modal below.
      */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={800}
        className="crisis-modal"
        // key={singleCrisisData && singleCrisisData[0]?.id} // REMOVED
        style={{
          padding: 0,
          // Ant Design Modal v4+ supports backdropFilter via maskStyle
        }}
        bodyStyle={{
          padding: 0,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow:
            '0 12px 44px -8px rgba(91,123,255,0.09), 0 2px 16px -4px rgba(38,50,56,0.03)',
          background: '#f7f9fb'
        }}
        maskStyle={{
          // This is the important addition for a blurry modal background
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'rgba(0,0,0,0.16)'
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px] py-24">
            <span className="text-lg font-semibold text-blue-500">Loading...</span>
          </div>
        ) : singleCrisisData && singleCrisisData[0] ? (
          <div>
            <div className="relative group">
              {singleCrisisData[0]?.image?.length ? (
                <Carousel
                  autoplay
                  className="w-full"
                  dotPosition="bottom"
                  dots
                >
                  {singleCrisisData[0].image.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Crisis image ${idx + 1}`}
                      className="w-full h-56 sm:h-80 lg:h-[380px] object-cover transition duration-500 group-hover:brightness-[.90]"
                      style={{
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                    />
                  ))}
                </Carousel>
              ) : (
                <div
                  className="flex items-center justify-center bg-gray-200 w-full h-56 sm:h-80 lg:h-[380px]"
                  style={{
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                  }}
                >
                  <span className="text-lg text-gray-400">No Images</span>
                </div>
              )}
              <div className="absolute left-4 top-4 z-10">
                <Tag
                  color={
                    singleCrisisData[0]?.severity === "High"
                      ? "error"
                      : singleCrisisData[0]?.severity === "Medium"
                      ? "warning"
                      : "blue"
                  }
                  className="font-semibold text-base px-4 py-1 rounded-full shadow"
                  style={{ fontSize: 16, padding: '0 14px' }}
                >
                  {singleCrisisData[0]?.severity}
                </Tag>
              </div>
            </div>
            <div className="px-6 sm:px-10 py-8 bg-white rounded-b-3xl">
              <h1 className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {singleCrisisData[0]?.title}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-12 mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 font-medium">Location</span>
                  <span className="text-gray-800 font-semibold text-lg">{singleCrisisData[0]?.location}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span className="text-gray-900 font-semibold">
                    <Tag
                      color={
                        singleCrisisData[0]?.status === "Active"
                          ? "success"
                          : singleCrisisData[0]?.status === "Pending"
                          ? "warning"
                          : "default"
                      }
                      style={{ fontWeight: 600 }}
                    >
                      {singleCrisisData[0]?.status}
                    </Tag>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 font-medium">Help Needed</span>
                  <span className="text-gray-800">{singleCrisisData[0]?.required_help}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 font-medium">ID</span>
                  <span className="text-gray-400 select-all">{singleCrisisData[0]?.id}</span>
                </div>
              </div>
              <div className="mb-4">
                <span className="block text-gray-500 font-medium mb-1">Description</span>
                <p className="text-base text-gray-700 border bg-gray-50 rounded-lg p-4 leading-relaxed">
                  {singleCrisisData[0]?.description}
                </p>
              </div>
              {user?.user?.role === "Admin" && (
                <div className="flex items-center gap-4 mt-6">
                  <span className="font-semibold text-gray-700">Change Status:</span>
                  <Space wrap>
                    <Select
                      value={singleCrisisData[0]?.status}
                      style={{ width: 140, fontWeight: "bold" }}
                      onChange={handleChange}
                      options={[
                        { value: "Active", label: "Active" },
                        { value: "Pending", label: "Pending" },
                      ]}
                    />
                  </Space>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <span>No crisis details found.</span>
          </div>
        )}
      </Modal>
      
      {/* Perfectly Redesigned Add New Crisis Card */}
      <div className="mt-12 mb-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Report New Crisis</h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Help us respond quickly by providing detailed information about the emergency</p>
        </div>

      <Card
          className="w-full shadow-2xl rounded-2xl sm:rounded-3xl border-0 overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-4 sm:p-6 lg:p-8 text-white">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <PlusOutlined className="text-lg sm:text-xl lg:text-2xl" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">Emergency Report Form</h3>
            </div>
            <p className="text-center text-white/90 text-sm sm:text-base">Fill out the form below to report a crisis situation</p>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 bg-gray-50">
            <div className="">
              {/* Left: Upload Section */}
              <div className="space-y-4 lg:space-y-6">
                <div className="text-center">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <CloudUploadOutlined className="text-blue-600 text-lg sm:text-xl" />
                    Upload Evidence
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Photos and documents help us understand the situation better</p>
                </div>
                
              <Dragger {...props} className="">
                <div className="flex flex-col items-center text-xs text-gray-500">
                  <CloudUploadOutlined className="text-xl text-blue-500 mb-1" />
                  <div>Drop files here or click</div>
                </div>
              </Dragger>

                {/* File List Display */}
                {file.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Uploaded Files ({file.length})
                      </h5>
                      <button
                        onClick={() => setFile([])}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors self-start sm:self-auto"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 sm:max-h-48 lg:max-h-56 overflow-y-auto">
                      {file.map((fileItem, index) => (
                        <div key={index} className="flex items-start sm:items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            {/* File Icon */}
                            <div className="flex-shrink-0">
                              {(() => {
                                const fileObj = fileItem.originFileObj || fileItem;
                                const isImage = fileObj?.type?.startsWith('image/') || fileItem.type?.startsWith('image/');
                                
                                if (isImage) {
                                  try {
                                    return (
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                        <img 
                                          src={URL.createObjectURL(fileObj)} 
                                          alt="Preview" 
                                          className="w-full h-full object-cover"
                                          style={{ 
                                            minWidth: '100%', 
                                            minHeight: '100%',
                                            maxWidth: 'none',
                                            maxHeight: 'none'
                                          }}
                                          onError={(e) => {
                                            console.log('Image load error:', e);
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                          }}
                                        />
                                        <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center" style={{display: 'none'}}>
                                          <CloudUploadOutlined className="text-gray-400 text-sm sm:text-base" />
                                        </div>
                                      </div>
                                    );
                                  } catch (error) {
                                    console.log('Error creating object URL:', error);
                                    return (
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <CloudUploadOutlined className="text-blue-600 text-sm sm:text-base" />
                                      </div>
                                    );
                                  }
                                } else {
                                  return (
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg bg-blue-100 flex items-center justify-center">
                                      <CloudUploadOutlined className="text-blue-600 text-sm sm:text-base" />
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                            
                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {fileItem.name || 'Unknown file'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {fileItem.size ? `${(fileItem.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                              </p>
                              <p className="text-xs text-gray-400 hidden lg:block">
                                Type: {fileItem.type || fileItem.originFileObj?.type || 'Unknown'}
                              </p>
                            </div>
                            
                            {/* Status - Hidden on mobile */}
                            <div className="flex-shrink-0 hidden sm:flex">
                              <div className="flex items-center gap-1 text-green-600">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                                <span className="text-xs">Ready</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => {
                              const newFileList = file.filter((_, i) => i !== index);
                              setFile(newFileList);
                            }}
                            className="ml-2 sm:ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove file"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
          </div>

              {/* Right: Form Section */}
              <div className="space-y-4 lg:space-y-6 mt-12">
                <div className="text-center">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Crisis Details
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Provide accurate information to help emergency responders</p>
                </div>

            <Form
              name="crisis"
              onFinish={onFinish}
              layout="vertical"
                  className="space-y-4 lg:space-y-6"
              autoComplete="off"
            >
                  {/* Title and Location Row */}
                  <div className="grid grid-cols-1 gap-4 lg:gap-6">
                <Form.Item
                  name="title"
                      label={<span className="text-gray-700 font-semibold text-sm sm:text-base">Crisis Title *</span>}
                  rules={[{ required: true, message: 'Please input the crisis title!' }]}
                >
                  <Input
                        placeholder="e.g., Severe flooding in downtown area"
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base"
                        size="large"
                  />
                </Form.Item>
                    
                <Form.Item
                  name="location"
                      label={<span className="text-gray-700 font-semibold text-sm sm:text-base">Exact Location *</span>}
                  rules={[{ required: true, message: 'Please input the location!' }]}
                >
                  <Input
                        placeholder="e.g., 123 Main St, Miami, FL 33101"
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base"
                        size="large"
                  />
                </Form.Item>
              </div>

                  {/* Severity and Help Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <Form.Item
                  name="severity"
                      label={<span className="text-gray-700 font-semibold text-sm sm:text-base">Severity Level *</span>}
                  rules={[{ required: true, message: 'Please select the severity!' }]}
                >
                  <Select
                    placeholder="Select severity"
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl"
                        size="large"
                      >
                        <Option value="Low">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm sm:text-base">Low - Minor impact</span>
                          </div>
                        </Option>
                        <Option value="Medium">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm sm:text-base">Medium - Moderate impact</span>
                          </div>
                        </Option>
                        <Option value="High">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm sm:text-base">High - Critical impact</span>
                          </div>
                        </Option>
                  </Select>
                </Form.Item>
                    
                <Form.Item
                  name="requiredHelp"
                      label={<span className="text-gray-700 font-semibold text-sm sm:text-base">Urgent Needs *</span>}
                  rules={[{ required: true, message: 'Please input the required help!' }]}
                >
                  <Input
                        placeholder="e.g., Medical supplies, rescue teams"
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base"
                        size="large"
                  />
                </Form.Item>
              </div>

                  {/* Description */}
              <Form.Item
                name="description"
                    label={<span className="text-gray-700 font-semibold text-sm sm:text-base">Detailed Description *</span>}
                rules={[{ required: true, message: 'Please input the description!' }]}
              >
                <TextArea
                      rows={4}
                      placeholder="Provide a comprehensive description of the crisis situation, including:&#10;• Current conditions and immediate threats&#10;• Number of people affected&#10;• Any injuries or casualties&#10;• Weather conditions&#10;• Access routes and obstacles&#10;• Any other relevant information"
                      className="rounded-lg sm:rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm sm:text-base resize-none"
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

                  {/* Submit Button */}
                  <div className="pt-2 sm:pt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                      loading={isLoading}
                      className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-0 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                      {isLoading ? 'Submitting Report...' : 'Submit Crisis Report'}
                </Button>
                    
                    <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                      Your report will be reviewed and emergency services will be notified immediately
                    </p>
                  </div>
            </Form>
              </div>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default Crisis;