import "swiper/css";
import React from "react";
import { Carousel } from "antd";
import { Card, Spin } from "antd";
import { Link } from "react-router-dom";
import d1 from "../assets/images/d1.jpg";
import d2 from "../assets/images/d2.jpg";
import d3 from "../assets/images/d3.jpg";
import d4 from "../assets/images/d4.jpg";
import { MoveRight } from "lucide-react";
import { RiTeamFill } from "react-icons/ri";
import { MdCrisisAlert } from "react-icons/md";
import VolunteerImage from "../assets/images/volunteer.jpg";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useGetCrisisQuery,
  useGetDonationandExpensesQuery,
  useGetDonationQuery,
  useGetVolunteerQuery,
} from "../redux/api/baseApi";

const Home = () => {
  const { data: getCrises, isLoading: getCrisesLoading } =
    useGetCrisisQuery(undefined);
  const { data: getVolunteer, isLoading: getVolunteerLoading } =
    useGetVolunteerQuery(undefined);
  const { data: donationDatas, isLoading: donationDatasLoading } =
    useGetDonationQuery(undefined);
  const {
    data: donationandExpensesDatas,
    isLoading: isLoadingDonationandExpenses,
  } = useGetDonationandExpensesQuery(undefined);

  if (
    donationDatasLoading ||
    getCrisesLoading ||
    getVolunteerLoading ||
    isLoadingDonationandExpenses
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading data, please wait..." size="large" vertical={true} />
      </div>
    );
  }

  if (
    !donationDatas ||
    !getCrises ||
    !donationandExpensesDatas ||
    !getVolunteer
  ) {
    return <div>Error loading data, please refresh or try again later.</div>;
  }

  console.log(donationandExpensesDatas[0]);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
      <div>
        {/* Hero Section */}
        <div className="flex justify-center lg:flex-row flex-col w-full mt-12 gap-12 px-8">
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6 w-fit">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Active Disaster Management System
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
              Swift Action for a <span className="">Safer</span>{" "}
              <br className="hidden sm:block" /> Tomorrow
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-7 sm:leading-8 text-gray-600 max-w-2xl">
              Join our mission to provide timely assistance, resources, and
              support during
              <br className="hidden sm:block" />
              disasters, ensuring safety and resilience for all communities.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/donation"
                className="btn-primary-modern inline-flex items-center group w-full justify-center"
              >
                Donate Now
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                  <MoveRight />
                </span>
              </Link>
              <Link
                to="/volunteer"
                className="btn-secondary-modern inline-flex items-center w-full justify-center"
              >
                Become Volunteer
              </Link>
            </div>
          </div>
          <div>
            <div className="stat">
              <div className="stat-figure text-secondary"></div>
              <div className="stat-title mb-4 mt-6 font-thin text-xl">
                Total Funds
              </div>
              <div className="stat-value text-secondary text-8xl text-emerald-200 font-bold">
                <sup className="font-medium">$</sup>
                {donationDatas[0]?.sum}
              </div>
              <div className="stat-desc"></div>
            </div>
          </div>
        </div>

        {/* Crisis Section */}
        {/* Crisis Stats and Carousel Section */}
        <div className="mt-12 mb-12 lg:mt-20 lg:mb-20 px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Carousel (On top in mobile, right in desktop) */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl pointer-events-none"></div>
                <Carousel
                  autoplay
                  className="w-full rounded-2xl overflow-hidden shadow-2xl"
                >
                  {[d1, d2, d3, d4].map((imgSrc, idx) => (
                    <div key={idx}>
                      <img
                        src={imgSrc}
                        alt={`Disaster ${idx + 1}`}
                        className="w-full h-auto object-cover transition-transform duration-200 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
            {/* Active Crises Count (Below in mobile, left in desktop) */}
            <div className="flex justify-center items-center order-2 lg:order-1">
              <div>
                <div className="stat-title mb-4 mt-6 font-thin text-xl">
                  Active Crises
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center w-[120px] h-[120px]">
                    <span className="absolute inset-0 flex items-center justify-center text-red-400 text-[200px] font-bold">
                      {Array.isArray(getCrises) ? getCrises.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8 mb-8 lg:mt-12 lg:mb-12 px-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Financial Overview
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track our daily funds and expenses to ensure transparent disaster
              relief operations
            </p>
          </div>
          <Card className="w-full card-modern">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Donations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Expenses</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={donationandExpensesDatas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="total_donations"
                    fill="#3b82f6"
                    name="Donations"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="total_expenses"
                    fill="#22c55e"
                    name="Expenses"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Volunteers Section */}
        <div className="mt-12 mb-12 lg:mt-20 lg:mb-20 px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="relative group">
                <img
                  src={VolunteerImage}
                  className="rounded-2xl w-full h-auto object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300"
                  alt="Volunteers"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center items-center">
              <div className="text-center">
                <div className="stat-title mb-4 mt-6 font-thin text-xl">
                  Total Volunteers
                </div>
                <div className="text-[220px] font-bold text-green-400 flex items-center justify-center">
                  {getVolunteer.length}{" "}
                </div>
                <div className="text-sm text-gray-500">
                  Dedicated to helping others
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
