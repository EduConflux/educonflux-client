import { apiSlice } from './apiSlice';

export interface ClassroomChannel {
  id: number;
  classroomName: string;
  sectionCode?: string;
  courseTitle?: string;
  instructorName?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: number;
  classroomId: number;
  senderId: number;
  senderName: string;
  messageContent: string;
  timestamp: string;
  isPrivate?: boolean;
}

export interface SendChatMessageRequest {
  classroomId: number;
  messageContent: string;
  recipientId?: number;
}

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClassroomChannels: builder.query<ClassroomChannel[], void>({
      query: () => '/faculty/classrooms',
      providesTags: ['ClassroomPost'],
    }),

    getChatHistory: builder.query<ChatMessage[], number>({
      query: (classroomId) => `/classrooms/${classroomId}/chat`,
      providesTags: ['ChatMessage'],
    }),

    getPrivateChat: builder.query<ChatMessage[], { classroomId: number; userId: number }>({
      query: ({ classroomId, userId }) => `/classrooms/${classroomId}/chat/private/${userId}`,
      providesTags: ['ChatMessage'],
    }),

    sendChatMessage: builder.mutation<ChatMessage, SendChatMessageRequest>({
      query: (data) => ({
        url: `/classrooms/${data.classroomId}/chat`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ChatMessage'],
    }),
  }),
});

export const {
  useGetClassroomChannelsQuery,
  useGetChatHistoryQuery,
  useGetPrivateChatQuery,
  useSendChatMessageMutation,
} = chatApi;
