import React, { useState, useEffect } from 'react';
import { Button, Tooltip, notification } from 'antd';
import { FileTextOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

interface GenerateDescriptionButtonProps {
  companyId: string;
  onDescriptionGenerated: (description: string) => void;
  disabled?: boolean;
}

export const GenerateDescriptionButton: React.FC<GenerateDescriptionButtonProps> = ({
  companyId,
  onDescriptionGenerated,
  disabled = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleGenerateDescription = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post(`${API_URL}/companies/${companyId}/generate-description`);
      const { jobId } = response.data;

      // Connect to WebSocket and listen for job status
      const newSocket = io(WS_URL);
      setSocket(newSocket);

      newSocket.on(`job:${jobId}`, (data: any) => {
        if (data.status === 'completed') {
          notification.success({
            message: 'Description Generated',
            description: 'Company description has been generated successfully.'
          });
          onDescriptionGenerated(data.result?.description || '');
          setIsGenerating(false);
          newSocket.disconnect();
        } else if (data.status === 'failed') {
          notification.error({
            message: 'Generation Failed',
            description: data.error || 'Failed to generate company description. Please try again later.'
          });
          setIsGenerating(false);
          newSocket.disconnect();
        }
      });

      // Optionally, show a toast that generation has started
      notification.info({
        message: 'Generation Started',
        description: 'Company description generation has started. You will be notified when it is complete.'
      });

    } catch (error) {
      notification.error({
        message: 'Generation Failed',
        description: 'Failed to start description generation. Please try again later.'
      });
      setIsGenerating(false);
    }
  };

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <Tooltip title="Generate AI description">
      <Button
        icon={isGenerating ? <LoadingOutlined /> : <FileTextOutlined />}
        onClick={handleGenerateDescription}
        loading={isGenerating}
        disabled={disabled || isGenerating}
        type="primary"
        ghost
      >
        {isGenerating ? 'Generating...' : 'Generate Description'}
      </Button>
    </Tooltip>
  );
}; 