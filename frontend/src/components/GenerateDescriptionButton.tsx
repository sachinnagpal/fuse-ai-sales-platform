import React, { useState } from 'react';
import { Button, Tooltip, notification } from 'antd';
import { FileTextOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

  const handleGenerateDescription = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post(`${API_URL}/companies/${companyId}/generate-description`);
      const { description } = response.data;
      onDescriptionGenerated(description);
      notification.success({
        message: 'Description Generated',
        description: 'Company description has been generated successfully.'
      });
    } catch (error) {
      notification.error({
        message: 'Generation Failed',
        description: 'Failed to generate company description. Please try again later.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

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