import React from 'react';
import {
  Files,
  Cloud,
  Share2,
  Clock,
  Plus,
  ArrowUpRight
} from 'lucide-react';

import { Card } from '../../components/Card';
import Button from '../../components/Button';
import DocumentCard from '../../components/DocumentCard';
import { Link } from 'react-router-dom';

import { useDocuments } from '../../context/DocumentContext';
import { useAuth } from '../../context/AuthContext';

const DashboardHome = () => {
  const { documents = [] } = useDocuments();
  const { user } = useAuth();

  const recentUploads = documents.filter(
    (doc) => doc.created_at
  ).length;

  const stats = [
    {
      label: 'Total Files',
      value: documents.length.toString(),
      icon: <Files className="h-6 w-6" />,
      color:
        'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Storage Used',
      value: '1.2 GB / 5 GB',
      icon: <Cloud className="h-6 w-6" />,
      color:
        'text-teal-600 bg-teal-50 dark:bg-teal-900/20',
    },
    {
      label: 'Shared Files',
      value: '0',
      icon: <Share2 className="h-6 w-6" />,
      color:
        'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Recent Uploads',
      value: recentUploads.toString(),
      icon: <Clock className="h-6 w-6" />,
      color:
        'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.username || 'User'}!
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Here's an overview of your workspace.
          </p>
        </div>

        <Link to="/dashboard/upload">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Upload Document
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${stat.color}`}
              >
                {stat.icon}
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>

                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Documents */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            Recent Documents
          </h2>

          <Link
            to="/dashboard/library"
            className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:underline"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {documents.length === 0 ? (
          <Card className="p-8 text-center">
            <p>No documents uploaded yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents
              .slice(0, 4)
              .map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                />
              ))}
          </div>
        )}
      </section>

      {/* Storage Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-bold mb-4">
            Storage Breakdown
          </h3>

          <div className="space-y-4">
            <StorageItem
              label="PDF Documents"
              percent={65}
              color="bg-red-500"
            />

            <StorageItem
              label="Images & Graphics"
              percent={15}
              color="bg-blue-500"
            />

            <StorageItem
              label="Other Files"
              percent={20}
              color="bg-slate-400"
            />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              className="w-full"
            >
              Upgrade Storage
            </Button>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            <Plus className="h-8 w-8 text-primary-600" />
          </div>

          <div>
            <h3 className="font-bold text-lg">
              Organize Documents
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create folders and keep your
              documents structured.
            </p>
          </div>

          <Button variant="secondary">
            Create Folder
          </Button>
        </Card>
      </div>
    </div>
  );
};

const StorageItem = ({
  label,
  percent,
  color,
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-medium">
      <span>{label}</span>
      <span>{percent}%</span>
    </div>

    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${color}`}
        style={{
          width: `${percent}%`,
        }}
      />
    </div>
  </div>
);

export default DashboardHome;