import React from 'react'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'

import { ResponsiveBetweenRow, NoEscape } from '../shared/Layouts'
import PostLocation from './PostLocation'
import PostPrice from './PostPrice'
import PostSummaryPhoto from './PostSummaryPhoto'
import GrayableContainer from './GrayableContainer'
import { getDateRangeString } from '../../util/datetime'

const PostDetail = styled.div`
    margin-bottom: 10px;
    color: #175e88;
    font-size: 1.2em;
`

const PostDetailsContainer = styled.div`
    flex-grow: 1;
    box-sizing: border-box;
    margin: 10px 20px;
`

const PostTextSummary = styled.div`
    margin-top: 15px;
    font-size: 0.9em;
    color: #000000cc;
`

const PostSummaryContainer = styled.div`
    display: flex;
    margin: 10px 0;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 1px 1px 5px #0000001a;
    border: 1px solid #dce2e8;
    border-radius: 5px;
`

const PostTitle = styled.div`
    color: #434653;
    font-size: 1.3em;
    font-weight: bold;
`

//Generates a full width summary for a post, can be disabled
function PostSummary({ post, disabled, markerNumber }) {

    const isGarageSale = post.isGarageSale === true

    return (
        <GrayableContainer disabled={disabled}>
            <PostSummaryContainer>
                <PostSummaryPhoto post={post} markerNumber={markerNumber}/>
                <PostDetailsContainer>
                    <ResponsiveBetweenRow>
                        <PostTitle>
                            <NoEscape>
                                <Link to={`/post/${post.id}`}>
                                    {post.title}
                                </Link>
                            </NoEscape>
                        </PostTitle>
                        <NoEscape>
                            <PostLocation postDetails={post} />
                        </NoEscape>
                    </ResponsiveBetweenRow>
                    <PostDetail>
                        {isGarageSale ? (
                            getDateRangeString(post.startTime, post.endTime)
                        ) : (
                            <PostPrice price={post.price} />
                        )}
                    </PostDetail>
                    <PostTextSummary>
                        <NoEscape>
                            <ReactMarkdown source={post.description} />
                        </NoEscape>
                    </PostTextSummary>
                </PostDetailsContainer>
            </PostSummaryContainer>
        </GrayableContainer>
    )
}

export default PostSummary
