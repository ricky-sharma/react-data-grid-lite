/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { trackPromise } from 'react-data-grid-lite';

export const sampleData = [
    {
        ID: 1,
        Name: "Alice Johnson",
        Department: "Engineering",
        Title: "Frontend Developer",
        Email: "alice.johnson@example.com",
        Salary: "$121,000"
    },
    {
        ID: 2,
        Name: "Bob Smith",
        Department: "Engineering",
        Title: "Backend Developer",
        Email: "bob.smith@example.com",
        Salary: "125000"
    },
    {
        ID: 3,
        Name: "Steve Gomez",
        Department: "HR",
        Title: "Recruiter",
        Email: "steve.gomez@example.com",
        Salary: "$80,000"
    },
    {
        ID: 4,
        Name: "Carla Lee",
        Department: "Marketing",
        Title: "Content Strategist",
        Email: "carla.lee@example.com",
        Salary: "$72,000"
    },
    {
        ID: 5,
        Name: "Emily Davis",
        Department: "Sales",
        Title: "Account Executive",
        Email: "emily.davis@example.com",
        Salary: "$88,000"
    },
    {
        ID: 6,
        Name: "Davis James",
        Department: "Marketing",
        Title: "Content Creator",
        Email: "davis.james@example.com",
        Salary: "$80,000"
    },
    {
        ID: 7,
        Name: "Christy Davis",
        Department: "HR",
        Title: "Account Executive",
        Email: "emily.davis@example.com",
        Salary: "$75,000"
    },
    {
        ID: 8,
        Name: "Peter Parker",
        Department: "Engineering",
        Title: "IT Manager",
        Email: "peter.parker@example.com",
        Salary: "$120,000"
    },
    {
        ID: 9,
        Name: "Elvyn Davis",
        Department: "Marketing",
        Title: "Account Executive",
        Email: "emily.davis@example.com",
        Salary: "$95,000"
    },
    {
        ID: 10,
        Name: "Tom Davis",
        Department: "Sales",
        Title: "Account Executive",
        Email: "emily.davis@example.com",
        Salary: "$92,000"
    },
    {
        ID: 11,
        Name: "John Davis",
        Department: "Marketing",
        Title: "Account Executive",
        Email: "emily.davis@example.com",
        Salary: "$88,000"
    },
    {
        ID: 12,
        Name: "Emily James",
        Department: "HR",
        Title: "Account Executive",
        Email: "emily.davis@example.com",
        Salary: "$88,000"
    },
    {
        ID: 13,
        Name: "Esther Peter",
        Department: "HR",
        Title: "Junior Executive",
        Email: "esther.peter@example.com",
        Salary: "$64,000"
    },
    {
        ID: 14,
        Name: "Kane John",
        Department: "Marketing",
        Title: "Publishing Department",
        Email: "kane.john@example.com",
        Salary: "83,000"
    }
];

export const columns = [
    { name: 'ID', width: '80px' },
    { name: 'Name', alias: 'Full Name'},
    {
        alias: 'Department-Title',
        name: 'Department',
        concatColumns: {
            columns: ['Department', 'Title'],
            separator: '-'
        }
    },
    { name: 'Title', hidden: true },
    { name: 'Email'},
    { name: 'Salary', formatting: { type: 'currency' } }
];

export const useFetch = (api = 'books') => {
    const [data, setData] = useState([])
    useEffect(() => {
        const promise = fetch(`https://fakerapi.it/api/v2/${api}?_quantity=100`)
            .then(response => response.json())
            .then(response => { setData(response.data) })
        trackPromise(promise);
    }, [])

    return data;
}

export const useFetch2 = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        const promise = fetch(`https://jsonplaceholder.typicode.com/todos/`)
            .then(response => response.json())
            .then(response => { setData(response) })
        trackPromise(promise);
    }, [])

    return data;
}