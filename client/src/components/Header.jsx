import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlSearchParams = searchParams.get('searchTerm');
    if (urlSearchParams) {
      setSearch(urlSearchParams);
    }
  }, [location.search])

  const handleUserSignout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('searchTerm', search);
    const searchQuery = searchParams.toString();
    navigate(`/search?${searchQuery}`)

  }

  return (
    <Navbar className='border-b-2'>
      <Link to={'/'} className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold 
      dark:text-white'>
        <span className='px-2 bg-gradient-to-r from-indigo-500
       via-purple-500 to-pink-500 rounded-lg text-white'>
          Danial's
        </span>
        Blog
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <Button className='lg:hidden w-12 h-10' color={'gray'} pill>
        <AiOutlineSearch />
      </Button>

      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color={'gray'} pill onClick={() => { dispatch(toggleTheme()) }}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt={currentUser ? currentUser.username : 'user'}
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleUserSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <>
            <Link to={'/signin'}>
              <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
              </Button>
            </Link>
          </>
        )}


        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/projects'>
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header