export type Notice = {
  _id: string;
  title: string;
  description: string;
  category: string;
  noticeDate: string;

  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  filePublicId?: string;
  fileResourceType?: string;
  filePreviewUrls?: string[];

  createdAt: string;
  updatedAt: string;
};

export type NoticeApiResponse = {
  success: boolean;
  message?: string;
  data: Notice[];
};

export type PreviewFile = {
  fileUrl: string;
  fileType?: string;
  fileName?: string;
  filePreviewUrls?: string[];
};