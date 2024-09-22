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
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Volunteer Management" key="1">
          <Card>
            <Table columns={volunteerColumns} dataSource={volunteerData} />
          </Card>
        </TabPane>
        <TabPane tab="Crisis Management" key="2">
          <Card>
            <Table columns={crisisColumns} dataSource={crisisData} />
          </Card>
        </TabPane>
        <TabPane tab="Reports" key="3">
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => generateReport('donation')}
                block
              >
                Generate Daily Donation Report
              </Button>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => generateReport('expense')}
                block
              >
                Generate Daily Expense Report
              </Button>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={() => generateReport('inventory')}
                block
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