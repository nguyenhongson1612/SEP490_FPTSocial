import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

const USER_NAME = 'cf918cb4-db6b-4282-9c4e-fbb0cc28276d';

function ChatWindow({ messages }) {

    return (
        <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
            {messages.length > 0 ? (
                messages.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            justifyContent: message.sender_username === USER_NAME ? 'flex-end' : 'flex-start',
                            marginBottom: 2,
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: '70%',
                                padding: 1,
                                borderRadius: 2,
                                backgroundColor: message.sender_username === USER_NAME ? 'orange' : 'lightgray',
                                color: message.sender_username === USER_NAME ? 'white' : 'black',
                            }}
                        >
                            <Typography variant="body1">
                                <strong>{message.sender_username}:</strong> {message.text}
                            </Typography>
                        </Box>
                    </Box>
                ))
            ) : (
                <Typography variant="body1">No messages to display.</Typography>
            )}
        </Box>
    );
}

export default ChatWindow;