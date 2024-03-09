// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** genResultByAi POST /api/chat/gen/result */
export async function genResultByAiUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.genResultByAiUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseChatAiResponse_>('/api/chat/gen/result', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** genResultByMq POST /api/chat/gen/result/mq */
export async function genResultByMqUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.genResultByMqUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseChatAiResponse_>('/api/chat/gen/result/mq', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getMyChatListByPage POST /api/chat/my/list/page */
export async function getMyChatListByPageUsingPOST(
  body: API.ChatQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageChat_>('/api/chat/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
