'use client';
import React from 'react';

export default function TokenizedEngagementGateway() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-900 to-blue-900 cursor-pointer transition hover:scale-105"
      onClick={() => window.location.href = 'https://683caf45083d3e7c75641d06--musical-tarsier-3e2be3.netlify.app/' }
      title="Go to Tokenized Engagement Platform"
    >
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center max-w-xl w-full border-4 border-cyan-300/40 hover:border-blue-400 transition">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-center drop-shadow-lg">
          Tokenized Engagement
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 text-center max-w-md">
          Unlock the next level of creator-fan interaction. Click anywhere to access the Tokenized Engagement dashboard and start engaging your community with unique tokens!
        </p>
        <span className="inline-block bg-white/20 px-6 py-3 rounded-xl text-xl font-semibold text-white shadow-lg border border-white/30">
          Gateway to Engagement Platform
        </span>
      </div>
      <p className="mt-10 text-white/60 text-center text-sm">Powered by ProductiveFi</p>
    </div>
  );
}