const clientId = '469241745606-obmslsb0mqlj56dr1012fg69k889032e.apps.googleusercontent.com';
const redirectUri = 'https://yohanchoi1234.github.io/google-contacts-viewer/';
const scope = 'https://www.googleapis.com/auth/contacts.readonly';

document.getElementById('login').addEventListener('click', () => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&include_granted_scopes=true`;
  window.location.href = authUrl;
});

window.onload = () => {
  if (window.location.hash.includes('access_token')) {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get('access_token');
    fetchContacts(token);
  }
};

async function fetchContacts(token) {
  const res = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  renderContacts(data.connections || []);
}

function renderContacts(connections) {
  const container = document.getElementById('contacts');

  if (connections.length === 0) {
    container.innerHTML = `<p class="text-gray-500">연락처가 없습니다.</p>`;
    return;
  }

  const rows = connections.map(person => {
    const name = person.names?.[0]?.displayName || '이름 없음';
    const email = person.emailAddresses?.[0]?.value || '-';
    const phone = person.phoneNumbers?.[0]?.value || '-';

    return `
      <tr class="border-b hover:bg-gray-100">
        <td class="p-2">${name}</td>
        <td class="p-2">${email}</td>
        <td class="p-2">${phone}</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <table class="min-w-full bg-white border rounded shadow">
      <thead class="bg-blue-100">
        <tr>
          <th class="text-left p-2">Name</th>
          <th class="text-left p-2">Email</th>
          <th class="text-left p-2">Number</th>
        </tr>
      </thead>Add commentMore actions
      <tbody>${rows}</tbody>
    </table>
  `;
}
//adfasdfsadjkfjwefoiefjihnoasdfiopehfjioweahf