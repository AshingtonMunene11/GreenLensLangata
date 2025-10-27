"use client";
import React, { use } from 'react';
import { useState, useEffect } from 'react';

function ai_predictions() {
    const [insights, setInsights] = useState(null);

useEffect(() => {
    if (!polygon) return;

    const fetchInsights = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/polygon-temperatures-ai`
  return (
    <div>ai_predictions</div>
  )
}

export default ai_predictions