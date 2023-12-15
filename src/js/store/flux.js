const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      contacts: [],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },
      loadSomeData: () => {
        /**
					fetch().then().then(data => setStore({ "foo": data.bar }))
				*/
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
    loadContacts: async () => {
      try {
        const response = await fetch(
          "https://playground.4geeks.com/apis/fake/contact/agenda/santiago_agenda"
        );
		const data = await response.json();
		setStore({ contacts: data});
      } catch (error) {
		console.error("Error to get contact:", error);
	  }
    },
	postContact: async newContact => {
		try {
			const response = await fetch("https://playground.4geeks.com/apis/fake/contact/", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(newContact)
			});
			const data = await response.json();
			setStore(prevStore => ({ contacts: [...prevStore.contacts, data]}));
		} catch (error) {
			console.error("Error to create contact:", error);
		}
	},
	updateExistingContact: async (contactId, updatedContact) => {
		try {
			const response = await fetch(`https://playground.4geeks.com/apis/fake/contact/${contactId}`, {
				method: "PUT",
				headers: {"Content-Type": "applications/json"},
				body: JSON.stringify(updatedContact)
			});
			const data = await response.json();
			setStore(prevStore => ({
				contacts: prevStore.contacts.map(contact => (contactId === contactId ? data : contact))
			}));
		} catch (error) {
			console.error("Error updating contact:", error);
		}
	},
	deleteContact: async contactId => {
		const contactConfirmed = window.confirm ("Are you sure you want to delete this contact?");
		if(!contactConfirmed) return;
		
		try {
			await fetch(`https://playground.4geeks.com/apis/fake/contact/${contactId}`, {
				method: "DELETE",
			});
			setStore(prevStore => ({
				contacts: prevStore.contacts.filter(contact => contact.id != contactId)
			}));
		} catch (error) {
			console.error("Error deleting this contact:", error);
		}
	}, 
  };
};

export default getState;
