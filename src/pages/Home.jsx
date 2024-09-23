import React from 'react';
import { Row, Col, Card, Statistic, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import VolunteerImage from '../assets/images/volunteer.jpg'
import { RiTeamFill } from 'react-icons/ri';
import { MdCrisisAlert } from 'react-icons/md';
import d1 from '../assets/images/d1.jpg'
import d2 from '../assets/images/d2.jpg'
import d3 from '../assets/images/d3.jpg'
import d4 from '../assets/images/d4.jpg'
import { Carousel } from 'antd';
import { useGetCrisisQuery, useGetDonationandExpensesQuery, useGetDonationQuery, useGetVolunteerQuery } from '../redux/api/baseApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { EffectCoverflow, Pagination } from 'swiper/modules';
const data = [
  { name: 'Mon', donations: 4000, expenses: 2400 },
  { name: 'Tue', donations: 3000, expenses: 1398 },
  { name: 'Wed', donations: 2000, expenses: 9800 },
  { name: 'Thu', donations: 2780, expenses: 3908 },
  { name: 'Fri', donations: 1890, expenses: 4800 },
  { name: 'Sat', donations: 2390, expenses: 3800 },
  { name: 'Sun', donations: 3490, expenses: 4300 },
];

const Home = () => {
  const { data: donationDatas, isLoading: donationDatasLoading } = useGetDonationQuery(undefined);
  const { data: getCrises, isLoading: getCrisesLoading } = useGetCrisisQuery(undefined);
  const { data: donationandExpensesDatas, isLoading: isLoadingDonationandExpenses } = useGetDonationandExpensesQuery(undefined);
  const { data: getVolunteer, isLoading: getVolunteerLoading } = useGetVolunteerQuery(undefined);
  console.log(donationandExpensesDatas[0])
  return (
    <div className="flex flex-col">
      <div>
        <div className="">
          <div className="mt-20 mb-20 grid lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Swift Action for a Safer <br /> Tomorrow</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 font-thin">
                Join our mission to provide timely assistance, resources, and support during <br />disasters, ensuring safety and resilience for all.
              </p>
              <div className="mt-10 flex items-center justify-start gap-x-6">
                <Link to='/donation' className="rounded-md font-thin bg-indigo-600 px-3.5 py-2.5 
                text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Donate Now <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div>
              <div className="stat">

                <div className="stat-figure text-secondary">
                </div>
                <div className="stat-title mb-4 mt-6 font-thin text-xl">Total Funds</div>
                <div className="stat-value text-secondary text-[150px] text-emerald-200 font-bold"><sup className="font-medium">$</sup>{donationDatas[0]?.sum}</div>
                <div className="stat-desc">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 mb-20 flex flex-col-reverse lg:flex-row ">
          <div className='w-1/2'>
            <div className="stat">
              <div className="stat-figure text-secondary">
              </div>
              <div className="stat-title mb-4 mt-6 font-thin text-xl">Active Crises</div>
              <div className="stat-value text-secondary text-red-200 font-bold flex items-end">
                <h1 className="text-[250px]">{getCrises.length}</h1><MdCrisisAlert className='mb-20' size={100} />
              </div>
            </div>
          </div>
          <div className='lg:w-1/2'>
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={true}
              modules={[EffectCoverflow, Pagination]}
              className="mySwiper"
            >
              <SwiperSlide>
                <img src={d1} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={d2} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={d3} />
              </SwiperSlide>
              <SwiperSlide>
                <img src={d4} />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div>
          <Card className="mt-6">
            <h2 className="text-xl font-bold mb-4">Daily Funds and Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={donationandExpensesDatas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_donations" fill="#8884d8" name="Donations" />
                <Bar dataKey="total_expenses" fill="#82ca9d" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div className="mt-20 mb-20 lg:grid grid-cols-2">
          <div className='mr-12'>
            <img src={VolunteerImage} className='rounded-xl' alt="" />
          </div>
          <div>
            <div className="stat">
              <div className="stat-figure text-secondary">
              </div>
              <div className="stat-title mb-4 mt-6 font-thin text-xl">Total Volunteers</div>
              <div className="stat-value text-secondary text-gray-200 font-bold flex items-end">
                <h1 className="text-[250px] blue-to-r">{getVolunteer.length}</h1><RiTeamFill className='mb-20' size={100} />
              </div>
              <div className="stat-desc">
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
