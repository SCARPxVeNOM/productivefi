'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function EngagementTasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Daily Check-in',
      description: 'Log in to the platform daily',
      reward: 5,
      difficulty: 'Easy',
      completed: true,
      timeEstimate: '1 min'
    },
    {
      id: 2,
      title: 'Create Content',
      description: 'Create and publish original content',
      reward: 50,
      difficulty: 'Medium',
      completed: false,
      timeEstimate: '30 mins'
    },
    {
      id: 3,
      title: 'Engage with Community',
      description: 'Comment on 5 different posts',
      reward: 25,
      difficulty: 'Easy',
      completed: false,
      timeEstimate: '15 mins'
    },
    {
      id: 4,
      title: 'Share on Social Media',
      description: 'Share platform content on your social media accounts',
      reward: 20,
      difficulty: 'Easy',
      completed: false,
      timeEstimate: '5 mins'
    },
    {
      id: 5,
      title: 'Refer a Friend',
      description: 'Invite a new user to join the platform',
      reward: 100,
      difficulty: 'Medium',
      completed: false,
      timeEstimate: '10 mins'
    },
    {
      id: 6,
      title: 'Complete Weekly Challenge',
      description: 'Participate in this week\'s community challenge',
      reward: 200,
      difficulty: 'Hard',
      completed: false,
      timeEstimate: '1 hour'
    }
  ]);

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <button 
        onClick={() => router.push('/tokenized-engagement-dashboard')}
        className="mb-6 text-cyan-400 hover:text-cyan-300"
      >
        ← Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Engagement Tasks</h1>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-white">Daily Progress: </span>
          <span className="text-cyan-400 font-bold">
            {tasks.filter(task => task.completed).length}/{tasks.length} Tasks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <Card 
            key={task.id} 
            className={`rounded-2xl shadow-xl transition duration-300 ${
              task.completed 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500' 
              : 'bg-black border border-gray-700 hover:border-cyan-500'
            }`}
          >
            <CardContent className="text-white p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{task.title}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                  task.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {task.difficulty}
                </span>
              </div>
              
              <p className="text-gray-400 mb-4">{task.description}</p>
              
              <div className="flex justify-between text-sm mb-6">
                <span className="text-gray-400">Est. time: {task.timeEstimate}</span>
                <span className="text-cyan-400 font-bold">{task.reward} TOKENS</span>
              </div>
              
              <button 
                onClick={() => toggleTaskCompletion(task.id)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition duration-300 ${
                  task.completed 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
                }`}
              >
                {task.completed ? 'Completed ✓' : 'Complete Task'}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-black rounded-2xl shadow-xl border border-purple-500">
        <CardContent className="text-white p-6">
          <h2 className="text-2xl font-bold mb-4">Weekly Challenge</h2>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-xl font-bold mb-2">Content Creator Challenge</h3>
            <p className="text-gray-300 mb-4">Create 3 pieces of high-quality content this week that receive at least 10 engagements each.</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Progress: 1/3 completed</span>
              <span className="text-purple-400 font-bold">500 TOKENS</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>
          <button className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition duration-300">
            View Challenge Details
          </button>
        </CardContent>
      </Card>
    </div>
  );
} 