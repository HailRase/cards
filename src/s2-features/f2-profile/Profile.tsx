import React, {useEffect, useState} from 'react';
import {StoreType, useAppSelector} from "../../s1-main/m2-bll/store";
import searchIcon from "../../assets/search_icon.png";

import s from './Profile.module.css'
import PacksTable from '../f5-packs/p3-packs-table/PacksTable';
import {useDispatch, useSelector} from 'react-redux';
import {
    fetchPacks,
    PackFilter,
    PackState,
    PackStatus
} from '../../s1-main/m2-bll/pack-reducer';
import Pagination from '../../s1-main/m1-ui/common/c4-Pagination/Pagination';
import {Navigate, useNavigate} from 'react-router-dom';
import DoubleRange, {
    RangeValue
} from "../../s1-main/m1-ui/common/DoubleRange/DoubleRange";
import usePackRange from "../../s3-utils/usePackRange";
import {PATH} from "../../s1-main/m1-ui/routes/routes";

const Profile = () => {

    useEffect(() => {
        dispatch(fetchPacks({...filter, user_id: id, page: 1}));
    }, [])

    const {userData, isAuth} = useAppSelector(state => state.auth)
    const dispatch = useDispatch();
    const id = useSelector<StoreType, string>(state => state.auth.userData?._id || "");

    const {filter, packsTotal} = useSelector<StoreType, PackState>(state => state.pack);
    const itemsPerPage = filter.pageCount;
    const maxPageNumber = Math.ceil(packsTotal / itemsPerPage);

    const onPageChange = (page: number) => {
        dispatch(fetchPacks({...filter, page}))
    }

    if (!isAuth) return <Navigate replace to={PATH.AUTH.LOGIN}/>

    return <div className={s.profileContainer}>
        <div className={s.profile}>
            <ProfileSidebar/>
            <main className={s.main}>
                <ProfileTable/>
                {maxPageNumber > 1 && <Pagination currentPage={filter.page}
                                                  maxPage={maxPageNumber}
                                                  onChange={onPageChange}
                                                  itemsPerPage={itemsPerPage}/>}
            </main>
        </div>
    </div>
};
export default Profile;

const ProfileSidebar = () => {

    const fixedAvatar = "data:image/png;base64,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";

    const avatar = useSelector<StoreType, string>(state => state.auth.userData?.avatar || fixedAvatar);
    const name = useSelector<StoreType, string>(state => state.auth.userData?.name || '');
    const navigate = useNavigate();

    // const changeProfileHandler1 = (name: string, avatar: string) => {
    //     dispatch(editAuthUserData(name, avatar))
    // }

    // Local Range Logic
    const handleRangeChange = usePackRange();


    const changeProfileHandler = () => {
        navigate("/edit")
    }

    return (
        <div className={s.profileSidebarContainer}>
            <div className={s.profileInfo}>
                <img src={avatar}/>
                <div className={s.profileName}>{name}</div>
                <div className={s.profileWork}>Front-end developer</div>
                <button onClick={changeProfileHandler}>Edit profile</button>
            </div>

            <div className={''}>
                <div className={s.title}>Number of cards</div>
                <br/>
                <DoubleRange min={0} max={150} onChange={handleRangeChange}/>
            </div>
        </div>)
};

const ProfileTable = () => {
    return (
        <div>
            <div className={s.profileHeaderContainer}>
                <h2>My packs list</h2>
                <div className={s.search_container}>
                    <img src={searchIcon}/>
                    <input className={s.input} type="text" /*value={searchValue} onChange={onSearchChange}*/
                           name="search"
                           placeholder="Search..."/>
                </div>
            </div>
            <div>
                <PacksTable/>
            </div>
        </div>)
};