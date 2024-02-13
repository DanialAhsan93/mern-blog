import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from "react-icons/bs";

export default function FooterComp() {
    return (
        <Footer container className=" border border-t-8 border-teal-500" >
            <div className='w-full max-w-7xl mx-auto'>
                <div className='grid w-full justify-between sm:flex md:grid-cols-1 '>
                    <div className='mt-5'>
                        <Link to="/" className='self-center text-sm sm:text-xl whitespace-nowrap
                              font-semibold dark:text-white'>
                            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                                  text-white rounded-lg'>
                                Danial's
                            </span>
                            Blog
                        </Link>
                    </div>
                    <div className='grid gird-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                        <div>
                            <Footer.Title title='About' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='#'
                                >
                                    100 JS Projects
                                </Footer.Link>
                                <Footer.Link
                                    href='#'
                                >
                                    Danial's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title='Follow us' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://github.com/DanialAhsan93'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link
                                    href='#'
                                >
                                    Discord
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title='Legal' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='#'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link
                                    href='#'
                                >
                                    terms &amp; conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>


                    </div>
                </div>
                <Footer.Divider />
                <div className='w-full sm:flex sm:items-center sm:justify-between'>
                    <Footer.Copyright href='#' by="Danial's Blog" year={new Date().getFullYear()} />
                    <div className='flex sm:mt-0 mt-4 sm:justify-center gap-6'>
                        <Footer.Icon href='#' icon={BsFacebook} />
                        <Footer.Icon href='#' icon={BsInstagram} />
                        <Footer.Icon href='#' icon={BsTwitter} />
                        <Footer.Icon href='#' icon={BsGithub} />
                        <Footer.Icon href='#' icon={BsDribbble} />
                    </div>
                </div>

            </div>

        </Footer>
    )
}
