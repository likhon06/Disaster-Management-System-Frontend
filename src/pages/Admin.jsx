import React from 'react';
import { Tabs, Card, Table, Tag, Space, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const volunteerColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: status => (
      <Tag color={status === 'Approved' ? 'green' : 'orange'}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Approve</a>
        <a>Reject</a>
        <a>Assign Task</a>
      </Space>
    ),
  },
];

const crisisColumns = [
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
    key: 'severity',
    dataIndex: 'severity',
    render: severity => (
      <Tag color={severity === 'High' ? 'red' : severity === 'Medium' ? 'orange' : 'green'}>
        {severity}
      </Tag>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: status => (
      <Tag color={status === 'Active' ? 'green' : 'orange'}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Change Status</a>
        <a>Edit</a>
      </Space>
    ),
  },
];

const volunteerData = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    phone: '(555) 555-1234',
    status: 'Pending',
  },
  // Add more sample data
];

const crisisData = [
  {
    key: '1',
    title: 'Flood in Riverside',
    location: 'Riverside, CA',
    severity: 'High',
    status: 'Active',
  },
  // Add more sample data
];

const Admin = () => {
  const generateReport = (type) => {
    console.log(`Generating ${type} report`);
    // Implement report generation logic here
  };

  return (
    <div className="mt-8 mb-8 lg:mt-20 lg:mb-20 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Admin Management</h1>
      <Tabs defaultActiveKey="1" className="w-full">
        <TabPane tab="Volunteer Management" key="1">
          <Card className="w-full">
            <div className="overflow-x-auto">
              <Table columns={volunteerColumns} dataSource={volunteerData} scroll={{ x: "max-content" }} />
            </div>
          </Card>
        </TabPane>
        <TabPane tab="Crisis Management" key="2">
          <Card className="w-full">
            <div className="overflow-x-auto">
              <Table columns={crisisColumns} dataSource={crisisData} scroll={{ x: "max-content" }} />
            </div>
          </Card>
        </TabPane>
        <TabPane tab="Reports" key="3">
          <Card className="w-full max-w-2xl mx-auto">
            <Space direction="vertical" style={{ width: '100%' }} className="w-full">
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => generateReport('donation')}
                className="w-full"
                size="large"
              >
                Generate Daily Donation Report
              </Button>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => generateReport('expense')}
                className="w-full"
                size="large"
              >
                Generate Daily Expense Report
              </Button>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => generateReport('inventory')}
                className="w-full"
                size="large"
              >
                Generate Inventory Report
              </Button>
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Admin;