import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Container, Box, TextField, Button, Typography, Paper,
  AppBar, Toolbar, IconButton, Select, MenuItem, FormControl,
  InputLabel, CircularProgress, Divider, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('debug');
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4o');
  const [openaiApiKey, setOpenaiApiKey] = useState(localStorage.getItem('openaiApiKey') || '');
  const [anthropicApiKey, setAnthropicApiKey] = useState(localStorage.getItem('anthropicApiKey') || '');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [availableModels, setAvailableModels] = useState({
    openai: ['gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
  });
  
  const messagesEndRef = useRef(null);
  
  // Fetch available models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('/api/models');
        setAvailableModels(response.data);
        
        // Set default model based on available models
        if (response.data.openai && response.data.openai.length > 0) {
          setModel(response.data.openai[0]);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    
    fetchModels();
  }, []);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle API key changes
  const handleOpenaiApiKeyChange = (event) => {
    const newKey = event.target.value;
    setOpenaiApiKey(newKey);
    localStorage.setItem('openaiApiKey', newKey);
  };
  
  const handleAnthropicApiKeyChange = (event) => {
    const newKey = event.target.value;
    setAnthropicApiKey(newKey);
    localStorage.setItem('anthropicApiKey', newKey);
  };
  
  const handleOpenApiKeyDialog = () => {
    setShowApiKeyDialog(true);
  };
  
  const handleCloseApiKeyDialog = () => {
    setShowApiKeyDialog(false);
  };
  
  // Check if API key is available for the selected provider
  const isApiKeyAvailable = () => {
    if (provider === 'openai') {
      return openaiApiKey.trim() !== '';
    } else if (provider === 'anthropic') {
      return anthropicApiKey.trim() !== '';
    }
    return false;
  };
  
  // Handle provider change
  const handleProviderChange = (event) => {
    const newProvider = event.target.value;
    setProvider(newProvider);
    
    // Set default model for the selected provider
    if (availableModels[newProvider] && availableModels[newProvider].length > 0) {
      setModel(availableModels[newProvider][0]);
    }
    
    // Show API key dialog if key is not set
    if (newProvider === 'openai' && openaiApiKey.trim() === '') {
      setShowApiKeyDialog(true);
    } else if (newProvider === 'anthropic' && anthropicApiKey.trim() === '') {
      setShowApiKeyDialog(true);
    }
  };
  
  // Handle model change
  const handleModelChange = (event) => {
    setModel(event.target.value);
  };
  
  // Handle mode change
  const handleModeChange = (event) => {
    setMode(event.target.value);
  };
  
  // Handle input change
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!input.trim()) return;
    
    // Check if API key is available
    if (!isApiKeyAvailable()) {
      setShowApiKeyDialog(true);
      return;
    }
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Get the appropriate API key
      const apiKey = provider === 'openai' ? openaiApiKey : anthropicApiKey;
      
      // Send request to backend
      const response = await axios.post('/api/chat', {
        provider,
        model,
        mode,
        apiKey,
        messages: [...messages, userMessage]
      });
      
      // Add assistant response to chat
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: response.data.response }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'assistant',
          content: `⚠️ Error: ${error.response?.data?.error || error.message || 'Unknown error'}`
        }
      ]);
      
      // If the error is related to the API key, show the dialog
      if (error.response?.status === 401 ||
          error.response?.data?.error?.includes('API key') ||
          error.message?.includes('API key')) {
        setShowApiKeyDialog(true);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Custom renderer for code blocks in markdown
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };
  
  // Get mode color
  const getModeColor = (currentMode) => {
    switch (currentMode) {
      case 'code':
        return '#2196f3'; // Blue
      case 'ask':
        return '#4caf50'; // Green
      case 'architect':
        return '#9c27b0'; // Purple
      case 'debug':
        return '#f44336'; // Red
      default:
        return '#f44336'; // Red
    }
  };
  
  // Get mode icon
  const getModeIcon = () => {
    return <BugReportIcon />;
  };
  
  return (
    <div className="App">
      <AppBar position="static" sx={{ backgroundColor: getModeColor(mode) }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            {getModeIcon()}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CodeWizard
          </Typography>
          
          {/* API Key Settings Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenApiKeyDialog}
            startIcon={<SettingsIcon />}
            sx={{ mr: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            API Keys
          </Button>
          
          {/* Mode Selection */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <InputLabel id="mode-select-label" sx={{ color: 'white' }}>Mode</InputLabel>
            <Select
              labelId="mode-select-label"
              id="mode-select"
              value={mode}
              onChange={handleModeChange}
              label="Mode"
              sx={{ color: 'white' }}
            >
              <MenuItem value="code">Code</MenuItem>
              <MenuItem value="ask">Ask</MenuItem>
              <MenuItem value="architect">Architect</MenuItem>
              <MenuItem value="debug">Debug</MenuItem>
            </Select>
          </FormControl>
          
          {/* Provider Selection */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <InputLabel id="provider-select-label" sx={{ color: 'white' }}>Provider</InputLabel>
            <Select
              labelId="provider-select-label"
              id="provider-select"
              value={provider}
              onChange={handleProviderChange}
              label="Provider"
              sx={{ color: 'white' }}
            >
              <MenuItem value="openai">OpenAI</MenuItem>
              <MenuItem value="anthropic">Anthropic</MenuItem>
            </Select>
          </FormControl>
          
          {/* Model Selection */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <InputLabel id="model-select-label" sx={{ color: 'white' }}>Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={model}
              onChange={handleModelChange}
              label="Model"
              sx={{ color: 'white' }}
            >
              {availableModels[provider]?.map((modelName) => (
                <MenuItem key={modelName} value={modelName}>
                  {modelName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Chat Messages */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            height: 'calc(100vh - 200px)', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            {messages.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  color: 'text.secondary'
                }}
              >
                <BugReportIcon sx={{ fontSize: 60, mb: 2, color: getModeColor(mode) }} />
                <Typography variant="h5" gutterBottom>
                  Welcome to CodeWizard!
                </Typography>
                <Typography variant="body1" align="center">
                  Paste your error message, stack trace, or buggy code below to get started.
                </Typography>
              </Box>
            ) : (
              messages.map((message, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Chip
                    label={message.role === 'user' ? 'You' : 'CodeWizard'}
                    size="small"
                    sx={{
                      mb: 1,
                      backgroundColor: message.role === 'user' ? 'primary.main' : getModeColor(mode),
                      color: 'white'
                    }}
                  />
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      maxWidth: '80%',
                      backgroundColor: message.role === 'user' ? 'primary.light' : 'background.paper',
                      color: message.role === 'user' ? 'white' : 'text.primary'
                    }}
                  >
                    {message.role === 'user' ? (
                      <Typography>{message.content}</Typography>
                    ) : (
                      <ReactMarkdown components={components}>
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </Paper>
                </Box>
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>
          
          {/* Input Form */}
          <Divider />
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message here..."
              value={input}
              onChange={handleInputChange}
              disabled={loading}
              multiline
              maxRows={4}
              sx={{ mr: 2 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={loading || !input.trim()}
              sx={{ backgroundColor: getModeColor(mode) }}
            >
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </Box>
        </Paper>
      </Container>
      
      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onClose={handleCloseApiKeyDialog}>
        <DialogTitle>API Key Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your API keys for the LLM providers you want to use.
            Your keys are stored locally in your browser and are never sent to our servers.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="openai-api-key"
            label="OpenAI API Key"
            type="password"
            fullWidth
            variant="outlined"
            value={openaiApiKey}
            onChange={handleOpenaiApiKeyChange}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            id="anthropic-api-key"
            label="Anthropic API Key"
            type="password"
            fullWidth
            variant="outlined"
            value={anthropicApiKey}
            onChange={handleAnthropicApiKeyChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApiKeyDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;