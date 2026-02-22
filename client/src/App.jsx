import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Plus, Minus, ArrowRight, Menu, X } from 'lucide-react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Admin Components
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';



const Logo = ({ className = "", dark = false }) => (
    <div className={`flex items-center justify-center h-12 w-12 md:h-16 md:w-16 ${className}`}>
        <img
            src="/logo.png"
            alt="ProfileEra Logo"
            className={`w-full h-full object-contain transition-transform duration-300 hover:scale-110 ${dark ? 'brightness-0 invert' : ''}`}
        />
    </div>
);

// --- Components ---

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "#home" },
        { name: "Who this is for?", href: "#who" },
        { name: "Our services", href: "#services" },
        { name: "Contact us", href: "#contact" },
        { name: "Trust", href: "#trust" }
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavClick = (e, href) => {
        e.preventDefault();
        setIsOpen(false);
        if (href.startsWith('#')) {
            const targetId = href.replace('#', '');
            const elem = document.getElementById(targetId);
            if (elem) {
                setTimeout(() => {
                    elem.scrollIntoView({ behavior: 'smooth' });
                }, 150); // slight delay to allow menu exit animation to start
            }
            window.history.pushState(null, '', href);
        } else {
            window.location.href = href;
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 py-4 md:py-6 bg-[#EFF6FF]/95 z-50 backdrop-blur-md border-b border-blue-100 shadow-sm px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="w-1/4">
                    <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="hover:opacity-80 transition-opacity">
                        <Logo className="scale-90 md:scale-100 origin-left" />
                    </a>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex flex-1 justify-center space-x-10 text-gray-700 font-bold text-sm tracking-tight">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className={`${link.name === 'Home' ? 'text-[#1D4ED8] border-b-2 border-[#1D4ED8] pb-1' : 'hover:text-blue-700 transition'}`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="hidden lg:block w-1/4"></div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className="p-2 text-[#1D4ED8] hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Toggle Navigation"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden overflow-hidden bg-white border-t border-blue-50 mt-4"
                    >
                        <div className="flex flex-col space-y-4 p-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="block w-full text-lg font-bold text-gray-800 hover:text-[#1D4ED8] transition-colors py-4 border-b border-gray-50 last:border-0"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const SectionBranding = ({ title }) => (
    <div className="flex flex-col items-center mb-8">
        <span className="text-[#1D4ED8] font-black text-xs uppercase tracking-[0.4em] mb-4">ProfileEra</span>
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider text-gray-900">{title}</h2>
    </div>
);

const Hero = () => {
    return (
        <section id="home" className="pt-40 pb-32 px-4 bg-white relative scroll-mt-20">
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 flex flex-col items-center"
                >
                    <h1 className="text-7xl md:text-8xl font-black text-[#1D4ED8] mb-4 tracking-tighter">ProfileEra</h1>
                    <p className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Career Acceleration & Interview Access Platform</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-20">
                    {/* Image Section with Blob */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative flex-1 w-full max-w-2xl"
                    >

                        <img
                            src="/hero.png"
                            alt="Hero Illustration"
                            className="relative z-10 w-full h-auto drop-shadow-2xl illustration-filter"
                        />
                    </motion.div>

                    {/* Text Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <h2 className="text-6xl md:text-8xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            Get More <br className="hidden md:block" /> Interviews.
                        </h2>
                        <p className="text-3xl md:text-4xl font-bold text-[#1D4ED8] mt-6">
                            Without Quitting Your Job
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const WhoIsThisFor = () => {
    return (
        <section id="who" className="py-24 bg-white border-t border-gray-100 scroll-mt-20">
            <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
                <div className="relative">
                    <div className="flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="w-full max-w-2xl"
                        >
                            {/* For You */}
                            <div className="text-center">
                                <span className="text-[#1D4ED8] font-black text-xs uppercase tracking-[0.4em] mb-4 block">
                                    PROFILEERA
                                </span>
                                <h3 className="text-4xl md:text-5xl font-extrabold mb-10 text-[#1D4ED8] tracking-tight">
                                    This is for YOU if:
                                </h3>
                                <ul className="space-y-6 inline-block text-left">
                                    {[
                                        "You are fresher OR experienced and serious about getting interviews",
                                        "You are tired of applying daily with no responses",
                                        "You understand interviews are earned, not sold",
                                        "You are willing to prepare and perform"
                                    ].map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start text-lg"
                                        >
                                            <div className="mr-4 mt-1 bg-[#1D4ED8] rounded-full p-1">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                            <span className="text-gray-700 font-semibold">{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 flex justify-center"
                    >
                        <img src="/w3.png" alt="Who this is for" className="w-full max-w-xl h-auto drop-shadow-xl illustration-filter" />
                    </motion.div>
                </div>

                <div className="mt-12 text-center text-gray-400 italic font-medium">
                    We work with serious candidates only.<br />
                    If you want shortcuts, this is not for you.
                </div>
            </div>
        </section>
    );
};

const Services = () => {
    const serviceData = [
        {
            title: "Resume Rewriting",
            subtitle: "(ATS + Recruiter Optimized)",
            features: ["Role-aligned content", "Keyword mapping", "7-second recruiter readability"],
            icon: <FileText className="text-[#1D4ED8]" />,
            desc: "Expertly crafted resumes designed to beat ATS and catch the recruiter's eye in 7 seconds."
        },
        {
            title: "Profile Optimization",
            icon: <Search className="text-[#1D4ED8]" />,
            desc: "SEO-driven LinkedIn and Naukri profile enhancements to rank you higher in recruiter searches."
        },
        {
            title: "Profile Marketing",
            icon: <Plus className="text-[#1D4ED8]" />,
            desc: "Strategic distribution and networking to put your profile in front of decision makers."
        },
        {
            title: "Interview Access Support",
            icon: <Plus className="text-[#1D4ED8]" />,
            desc: "Coaching and strategic outreach to secure interview slots for your target roles."
        }
    ];

    return (
        <section id="services" className="py-24 bg-gray-50 border-t border-gray-100 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
                <SectionBranding title="WHAT WE ACTUALLY DO" />
                <div className="grid md:grid-cols-2 gap-8">
                    {serviceData.map((service, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-10 rounded-[2.5rem] border-2 border-blue-100 bg-[#EFF6FF] hover:bg-white hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 group"
                        >
                            <div className="w-16 h-16 bg-[#1D4ED8] rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-transform">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{service.title}</h3>
                            <p className="text-gray-700 font-medium text-lg leading-tight">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

const ProblemAccordion = () => {
    const [openIndex, setOpenIndex] = useState(0);
    const problems = [
        { title: "ATS Rejection", content: "Your resume never reaches a human. We optimize for the 7-second recruiter rule." },
        { title: "Poor Positioning", content: "Recruiters can't understand your value quickly enough. We make it obvious." },
        { title: "Wrong Visibility", content: "Applying randomly doesn't equal being seen by the right people. Strategic positioning is key." },
        { title: "No Strategic Outreach", content: "We focus on intelligent response rates, not desperate mass applying." }
    ];

    return (
        <section className="py-24 px-6 md:px-10 bg-white border-t border-gray-100">
            <SectionBranding title="THE REAL PROBLEM" />
            <p className="text-center text-gray-700 font-bold mb-12 text-xl">Why Most Candidates Never Get Calls?</p>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
            >
                <div className="flex-1 flex flex-col items-center">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        src="/real_problem.png"
                        alt="Real Problem"
                        className="w-full max-w-sm h-auto mb-8 transition-transform filter-blue-gray"
                    />
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-100 font-bold text-[#1D4ED8] uppercase tracking-widest text-lg">
                        JOB INTERVIEW
                    </div>
                </div>
                <div className="flex-1 w-full space-y-2">
                    {problems.map((p, i) => (
                        <div key={i} className="border-b border-blue-100">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                                className="w-full flex items-center justify-between p-6 group transition-colors text-left"
                            >
                                <span className={`text-xl font-bold ${openIndex === i ? 'text-[#1D4ED8]' : 'text-gray-800'} group-hover:text-[#1D4ED8]`}>
                                    {p.title}
                                </span>
                                <div className="bg-gray-100 p-1 rounded-sm">
                                    {openIndex === i ? <Minus className="text-[#1D4ED8]" size={20} /> : <Plus className="text-gray-400" size={20} />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-6 pb-6 text-gray-600 font-medium">
                                            {p.content}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

const AccordionItem = ({ title, content }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300">
            <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-6 md:p-8 text-left">
                <span className={`text-xl md:text-2xl font-bold ${open ? 'text-[#1D4ED8]' : 'text-gray-800'}`}>{title}</span>
                <div className={`p-2 rounded-full ${open ? 'bg-blue-100 text-[#1D4ED8]' : 'bg-gray-100 text-gray-500'}`}>
                    {open ? <Minus size={24} /> : <Plus size={24} />}
                </div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-8 pt-0 text-gray-600 text-lg leading-relaxed bg-white">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};



const TrustSection = () => (
    <section id="trust" className="py-24 bg-white text-center border-t border-gray-100 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 mb-16">
            <SectionBranding title="TRUSTED BY OUR CLIENTS" />
        </div>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto bg-blue-100 rounded-[2rem] p-10 md:p-16 shadow-inner relative overflow-hidden border-2 border-blue-200"
        >
            <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 lg:gap-48 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center md:items-start border-l-4 border-blue-600 pl-6"
                >
                    <div className="text-6xl md:text-7xl font-black text-[#1D4ED8]">218+</div>
                    <div className="text-sm font-bold text-[#1D4ED8] uppercase tracking-tighter leading-tight mt-2 text-left">
                        Trusted by <br /> our Clients
                    </div>
                </motion.div>

                {/* Handshake Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="hidden lg:block"
                >
                    <img src="/handshake_icon.png" alt="Partnership" className="w-32 h-32 object-contain filter-blue-gray mix-blend-multiply" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center md:items-start border-l-4 border-blue-600 pl-6"
                >
                    <div className="text-6xl md:text-7xl font-black text-[#1D4ED8]">100%</div>
                    <div className="text-sm font-bold text-[#1D4ED8] uppercase tracking-tighter leading-tight mt-2 text-left">
                        Based on verified <br /> Client Engagements
                    </div>
                </motion.div>
            </div>
        </motion.div>
    </section>
);

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', contact: '', linkedin: '', naukri: '' });
    const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'

    const SuccessDialog = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setStatus('')}></div>
            <div className="bg-white rounded-[2.5rem] p-8 max-w-xs w-full relative z-10 text-center shadow-2xl border-2 border-blue-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">Thank You!</h3>
                <p className="text-gray-600 font-medium mb-8">Your application has been submitted successfully. Our team will review it and get back to you shortly.</p>
                <button
                    onClick={() => setStatus('')}
                    className="w-full bg-[#1D4ED8] text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#1E40AF] transition-colors shadow-lg shadow-blue-200"
                >
                    Dismiss
                </button>
            </div>
        </motion.div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) throw new Error("VITE_API_URL is not defined");

            const response = await axios.post(`${apiUrl}/api/leads`, {
                name: formData.name,
                contact: formData.contact,
                linkedin: formData.linkedin,
                naukri: formData.naukri
            });
            setStatus('success');
            setFormData({ name: '', contact: '', linkedin: '', naukri: '' });
        } catch (error) {
            console.error("Submission error:", error);
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="py-24 bg-gray-50 border-t border-gray-100 scroll-mt-20">
            <div className="max-w-2xl mx-auto px-6">
                <SectionBranding title="Apply Now" />
                <p className="text-gray-500 text-center mb-10">Fill in your details and let's get you hired.</p>

                <AnimatePresence>
                    {status === 'success' && <SuccessDialog />}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Name <span className="text-red-500">*</span></label>
                        <input
                            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-blue-100"
                            placeholder="Name"
                            value={formData.name}
                            onChange={e => {
                                const val = e.target.value;
                                if (/^[a-zA-Z\s]*$/.test(val)) {
                                    setFormData({ ...formData, name: val });
                                }
                            }}
                            required
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Contact number <span className="text-red-500">*</span></label>
                        <input
                            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-blue-100"
                            placeholder="Contact number"
                            value={formData.contact}
                            onChange={e => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val) && val.length <= 10) {
                                    setFormData({ ...formData, contact: val });
                                }
                            }}
                            required
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">LinkedIn profile (optional)</label>
                        <input
                            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-blue-100"
                            placeholder="LinkedIn profile"
                            value={formData.linkedin}
                            onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Naukri profile (optional)</label>
                        <input
                            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-blue-100"
                            placeholder="Naukri profile"
                            value={formData.naukri}
                            onChange={e => setFormData({ ...formData, naukri: e.target.value })}
                        />
                    </motion.div>

                    {status === 'error' && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-center font-bold"
                        >
                            Error submitting. Please try again.
                        </motion.p>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full bg-[#1D4ED8] text-white p-5 rounded-xl font-bold text-lg hover:bg-[#1E40AF] transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 mt-4 uppercase tracking-wider"
                    >
                        {status === 'sending' ? 'Submitting...' : 'Apply Now'}
                    </motion.button>
                </form>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
                <h2 className="text-blue-700 font-bold text-xl mb-4">contact us</h2>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start text-sm text-gray-700 font-medium space-y-8 md:space-y-0">
                <div className="space-y-4">
                    <div className="flex items-center">
                        <span className="mr-3">📧</span> operations@profileera.com
                    </div>
                    <div className="flex items-center">
                        <span className="mr-3">📞</span> (+91) 6309089944,7842907393
                    </div>
                    <div className="flex items-center">
                        <span className="mr-3">📍</span> Knowledge City, Rai Durg<br />Hyderabad - 500081, Telangana
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <Logo className="mb-2" />
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
                Copyright © 2026 ProfileEra - All Rights Reserved
            </div>
        </div>
    </footer>
);

const LandingPage = () => {
    return (
        <div className="font-sans text-gray-900 overflow-x-hidden">
            <Navbar />
            <Hero />
            <WhoIsThisFor />
            <ProblemAccordion />
            <TrustSection />
            <Services />
            <ContactForm />
            <Footer />
        </div>
    );
};

const App = () => {
    const [adminKey, setAdminKey] = useState(localStorage.getItem('adminKey'));

    const handleLogin = (key) => {
        setAdminKey(key);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminKey');
        setAdminKey(null);
    };

    return (
        <Router>
            <Routes>
                {/* Public Site */}
                <Route path="/" element={<LandingPage />} />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        adminKey ? (
                            <Navigate to="/admin/dashboard" />
                        ) : (
                            <AdminLogin onLogin={handleLogin} />
                        )
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        adminKey ? (
                            <AdminDashboard adminKey={adminKey} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/admin" />
                        )
                    }
                />

                {/* Catch-all redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
