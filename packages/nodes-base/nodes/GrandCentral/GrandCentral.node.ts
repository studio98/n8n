import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { gcApiRequest } from './GenericFunctions';
import { isEmpty } from 'lodash';

export class GrandCentral implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GrandCentral',
		name: 'grandcentral',
		icon: 'file:grandcentral.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Consume GrandCentral REST API',
		defaults: {
			name: 'GrandCentral',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'grandCentral',
				required: true,
				displayOptions: {
					show: {
						authentication: ['apiKey'],
					},
				},
				testedBy: {
					request: {
						method: 'GET',
						url: '/tools',
					},
				},
			},
		],
		requestDefaults: {
			baseURL: 'https://api.grandcentr.al/v1',
			url: '/tools',
		},
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'API Key',
						value: 'apiKey',
					},
				],
				default: 'apiKey',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Activities',
						value: 'activities',
					},
					{
						name: 'Billing',
						value: 'billing',
					},
					{
						name: 'Checklists',
						value: 'checklists',
					},
					{
						name: 'Comments',
						value: 'comments',
					},
					{
						name: 'Commissions',
						value: 'commissions',
					},
					{
						name: 'Contacts',
						value: 'contacts',
					},
					{
						name: 'Deals',
						value: 'deals',
					},
					{
						name: 'Financial',
						value: 'financial',
					},
					{
						name: 'Ideas',
						value: 'ideas',
					},
					{
						name: 'Knowledge Base',
						value: 'knowledge-base',
					},
					{
						name: 'Marketing Board',
						value: 'marketing-board',
					},
					{
						name: 'Organizations',
						value: 'organizations',
					},
					{
						name: 'Projects',
						value: 'projects',
					},
					{
						name: 'Proposals',
						value: 'proposals',
					},
					{
						name: 'Reviews',
						value: 'reviews',
					},
					{
						name: 'Subscriptions',
						value: 'subscriptions',
					},
					{
						name: 'Support',
						value: 'support',
					},
					{
						name: 'System',
						value: 'system',
					},
					{
						name: 'Tasks',
						value: 'tasks',
					},
					{
						name: 'Timesheets',
						value: 'timesheets',
					},
					{
						name: 'Transactions',
						value: 'transactions',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Users',
						value: 'users',
					},
				],
				default: 'activities',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['activities'],
					},
				},
				options: [
					{
						name: 'Get Activities',
						value: 'getActivities',
						description: 'Retrieve activities with optional filtering.',
						action: 'Get Activities',
					},
					{
						name: 'Create Activity',
						value: 'createActivity',
						description: 'Creates an activity in the organization by passing activity data',
						action: 'Create Activity',
					},
					{
						name: 'Create Project Activity',
						value: 'createProjectActivity',
						description:
							'Create an activity specifically linked to a project. This helps track project-related communications and actions.',
						action: 'Create Project Activity',
					},
					{
						name: 'Create Deal Activity',
						value: 'createDealActivity',
						description:
							'Create an activity specifically linked to a deal. This helps track deal-related communications and sales activities.',
						action: 'Create Deal Activity',
					},
					{
						name: 'Create Order Activity',
						value: 'createOrderActivity',
						description:
							'Create an activity specifically linked to an order. This helps track order-related communications and fulfillment activities.',
						action: 'Create Order Activity',
					},
					{
						name: 'Create Contact Activity',
						value: 'createContactActivity',
						description:
							'Create an activity specifically linked to a contact. This helps track contact-specific communications and interactions.',
						action: 'Create Contact Activity',
					},
				],
				default: 'getActivities',
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['getActivities'],
					},
				},
				description: 'Filter by contact ID',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['getActivities'],
					},
				},
				description: 'Filter by organization ID',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['getActivities'],
					},
				},
				description: 'Filter by project ID',
			},
			{
				displayName: 'Deal ID',
				name: 'dealId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['getActivities'],
					},
				},
				description: 'Filter by deal ID',
			},
			{
				displayName: 'Activity Type',
				name: 'activityType',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['getActivities'],
					},
				},
				description: 'Filter by activity type',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['getActivities'],
					},
				},
				description: 'Filter from start date (YYYY-MM-DD)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['getActivities'],
					},
				},
				description: 'Filter to end date (YYYY-MM-DD)',
			},
			{
				displayName: 'All Organizations',
				name: 'allOrgs',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['getActivities'],
					},
				},
				description: 'Include activities from all organizations (optional, defaults to false)',
			},
			{
				displayName: 'Contact ID',
				name: 'contact',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Contact ID (required)',
			},
			{
				displayName: 'Notes Result',
				name: 'notesResult',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Notes result text (required)',
			},
			{
				displayName: 'Activity Type',
				name: 'activityType',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description:
					'Activity type: leftMessage, noMessage, interview, interviewInPerson, note, meeting, other, sentEmail, email, ticket, appointment',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Activity content/message',
			},
			{
				displayName: 'For Date',
				name: 'forDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Unix timestamp for activity date',
			},
			{
				displayName: 'First Interview',
				name: 'firstInterview',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Boolean flag for first interview',
			},
			{
				displayName: 'Object ID',
				name: 'objectId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Related object ID',
			},
			{
				displayName: 'Object Type',
				name: 'objectType',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Object type: project, deal, order, contact, timeMaterial, marketingBoard',
			},
			{
				displayName: 'Incoming',
				name: 'incoming',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Boolean flag for incoming activity',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Organization ID',
			},
			{
				displayName: 'Is Marketing Board',
				name: 'isMarketingBoard',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createActivity'],
					},
				},
				description: 'Boolean flag for marketing board activity',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createProjectActivity'],
					},
				},
				description: 'Project ID to link the activity to (required)',
			},
			{
				displayName: 'Contact ID',
				name: 'contact',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createProjectActivity'],
					},
				},
				description: 'Contact ID (required)',
			},
			{
				displayName: 'Notes Result',
				name: 'notesResult',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createProjectActivity'],
					},
				},
				description: 'Notes result text (required)',
			},
			{
				displayName: 'Activity Type',
				name: 'activityType',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createProjectActivity'],
					},
				},
				description:
					'Activity type: leftMessage, noMessage, interview, interviewInPerson, note, meeting, other, sentEmail, email, ticket, appointment',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createProjectActivity'],
					},
				},
				description: 'Activity content/message (optional)',
			},
			{
				displayName: 'For Date',
				name: 'forDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createProjectActivity'],
					},
				},
				description: 'Unix timestamp for activity date (optional)',
			},
			{
				displayName: 'First Interview',
				name: 'firstInterview',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createProjectActivity'],
					},
				},
				description: 'Boolean flag for first interview (optional)',
			},
			{
				displayName: 'Incoming',
				name: 'incoming',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createProjectActivity'],
					},
				},
				description: 'Boolean flag for incoming activity (optional)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createProjectActivity'],
					},
				},
				description: 'Organization ID (optional)',
			},
			{
				displayName: 'Deal ID',
				name: 'dealId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createDealActivity'],
					},
				},
				description: 'Deal ID to link the activity to (required)',
			},
			{
				displayName: 'Contact ID',
				name: 'contact',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createDealActivity'],
					},
				},
				description: 'Contact ID (required)',
			},
			{
				displayName: 'Notes Result',
				name: 'notesResult',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createDealActivity'],
					},
				},
				description: 'Notes result text (required)',
			},
			{
				displayName: 'Activity Type',
				name: 'activityType',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createDealActivity'],
					},
				},
				description:
					'Activity type: leftMessage, noMessage, interview, interviewInPerson, note, meeting, other, sentEmail, email, ticket, appointment',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createDealActivity'],
					},
				},
				description: 'Activity content/message (optional)',
			},
			{
				displayName: 'For Date',
				name: 'forDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createDealActivity'],
					},
				},
				description: 'Unix timestamp for activity date (optional)',
			},
			{
				displayName: 'First Interview',
				name: 'firstInterview',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createDealActivity'],
					},
				},
				description: 'Boolean flag for first interview (optional)',
			},
			{
				displayName: 'Incoming',
				name: 'incoming',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createDealActivity'],
					},
				},
				description: 'Boolean flag for incoming activity (optional)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createDealActivity'],
					},
				},
				description: 'Organization ID (optional)',
			},
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createOrderActivity'],
					},
				},
				description: 'Order ID to link the activity to (required)',
			},
			{
				displayName: 'Contact ID',
				name: 'contact',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createOrderActivity'],
					},
				},
				description: 'Contact ID (required)',
			},
			{
				displayName: 'Notes Result',
				name: 'notesResult',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createOrderActivity'],
					},
				},
				description: 'Notes result text (required)',
			},
			{
				displayName: 'Activity Type',
				name: 'activityType',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createOrderActivity'],
					},
				},
				description:
					'Activity type: leftMessage, noMessage, interview, interviewInPerson, note, meeting, other, sentEmail, email, ticket, appointment',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createOrderActivity'],
					},
				},
				description: 'Activity content/message (optional)',
			},
			{
				displayName: 'For Date',
				name: 'forDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createOrderActivity'],
					},
				},
				description: 'Unix timestamp for activity date (optional)',
			},
			{
				displayName: 'First Interview',
				name: 'firstInterview',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createOrderActivity'],
					},
				},
				description: 'Boolean flag for first interview (optional)',
			},
			{
				displayName: 'Incoming',
				name: 'incoming',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createOrderActivity'],
					},
				},
				description: 'Boolean flag for incoming activity (optional)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createOrderActivity'],
					},
				},
				description: 'Organization ID (optional)',
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createContactActivity'],
					},
				},
				description: 'Contact ID to link the activity to (required)',
			},
			{
				displayName: 'Notes Result',
				name: 'notesResult',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createContactActivity'],
					},
				},
				description: 'Notes result text (required)',
			},
			{
				displayName: 'Activity Type',
				name: 'activityType',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createContactActivity'],
					},
				},
				description:
					'Activity type: leftMessage, noMessage, interview, interviewInPerson, note, meeting, other, sentEmail, email, ticket, appointment',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createContactActivity'],
					},
				},
				description: 'Activity content/message (optional)',
			},
			{
				displayName: 'For Date',
				name: 'forDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createContactActivity'],
					},
				},
				description: 'Unix timestamp for activity date (optional)',
			},
			{
				displayName: 'First Interview',
				name: 'firstInterview',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createContactActivity'],
					},
				},
				description: 'Boolean flag for first interview (optional)',
			},
			{
				displayName: 'Incoming',
				name: 'incoming',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createContactActivity'],
					},
				},
				description: 'Boolean flag for incoming activity (optional)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['activities'],
						operation: ['createContactActivity'],
					},
				},
				description: 'Organization ID (optional)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['billing'],
					},
				},
				options: [
					{
						name: 'Search Billing Invoices',
						value: 'searchBillingInvoices',
						description:
							'Search organization billing invoices with comprehensive filtering and module-specific details. Returns invoices from projects, subscriptions, work orders, and other billing modules with their related information.',
						action: 'Search Billing Invoices',
					},
				],
				default: 'searchBillingInvoices',
			},
			{
				displayName: 'Organization ID',
				name: 'organization_id',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['searchBillingInvoices'],
					},
				},
				description: 'Organization ID to filter invoices (optional)',
			},
			{
				displayName: 'Payment Status',
				name: 'payment_status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['searchBillingInvoices'],
					},
				},
				description: 'Payment status: paid, unpaid, partial, overdue (optional)',
			},
			{
				displayName: 'Module Type',
				name: 'module_type',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['searchBillingInvoices'],
					},
				},
				description: 'Module type: project, subscription, timeMaterial, order (optional)',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['searchBillingInvoices'],
					},
				},
				description: 'Filter by invoice date start range in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['searchBillingInvoices'],
					},
				},
				description: 'Filter by invoice date end range in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['searchBillingInvoices'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['checklists'],
					},
				},
				options: [
					{
						name: 'Get Checklists',
						value: 'getChecklists',
						description:
							'Retrieve checklists with comprehensive filtering options. Checklists are task management tools with sections and steps.',
						action: 'Get Checklists',
					},
					{
						name: 'Get Checklist',
						value: 'getChecklist',
						description:
							'Retrieve detailed information about a specific checklist by ID, including all sections, steps, and completion status.',
						action: 'Get Checklist',
					},
					{
						name: 'Create Checklist',
						value: 'createChecklist',
						description:
							'Create a new checklist with optional assignees and template support. Checklists help organize tasks into manageable sections and steps.',
						action: 'Create Checklist',
					},
					{
						name: 'Delete Checklist',
						value: 'deleteChecklist',
						description: 'Delete a checklist permanently. This action cannot be undone.',
						action: 'Delete Checklist',
					},
					{
						name: 'Toggle Checklist Step',
						value: 'toggleChecklistStep',
						description:
							'Toggle the completion status of a checklist step. Marks incomplete steps as complete and vice versa.',
						action: 'Toggle Checklist Step',
					},
					{
						name: 'Add Checklist Section',
						value: 'addChecklistSection',
						description: 'Add a new section to organize steps within a checklist.',
						action: 'Add Checklist Section',
					},
					{
						name: 'Add Checklist Step',
						value: 'addChecklistStep',
						description:
							'Add a new step to a checklist or section. Steps can have instructions, links, and sub-steps.',
						action: 'Add Checklist Step',
					},
				],
				default: 'getChecklists',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['getChecklists'],
					},
				},
				description: 'Search term to match checklist titles and descriptions (optional)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['getChecklists'],
					},
				},
				description: 'Filter by completion status: completed, pending, overdue, all (optional)',
			},
			{
				displayName: 'Assignee ID',
				name: 'assigneeId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['getChecklists'],
					},
				},
				description:
					'Filter by assigned user ID - use searchUsers to find valid user IDs (optional)',
			},
			{
				displayName: 'Recurring',
				name: 'recurring',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['getChecklists'],
					},
				},
				description: 'Filter by recurrence type: one-time, weekly, monthly, yearly (optional)',
			},
			{
				displayName: 'Is Sequential',
				name: 'isSequential',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['getChecklists'],
					},
				},
				description: 'Filter by sequential execution requirement (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['getChecklists'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Checklist ID',
				name: 'checklistId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['getChecklist'],
					},
				},
				description: 'Checklist ID to retrieve (required)',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['createChecklist'],
					},
				},
				description: 'Checklist title (required, max 255 characters)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['createChecklist'],
					},
				},
				description: 'Detailed description of the checklist (optional, max 1000 characters)',
			},
			{
				displayName: 'Is Sequential',
				name: 'isSequential',
				type: 'boolean',
				default: true,
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['createChecklist'],
					},
				},
				description: 'Whether steps must be completed in order - boolean (required)',
			},
			{
				displayName: 'Recurring',
				name: 'recurring',
				type: 'string',
				default: 'one-time',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['createChecklist'],
					},
				},
				description: 'Recurrence pattern: one-time, weekly, monthly, yearly (required)',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['createChecklist'],
					},
				},
				description: 'Date for the checklist in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['createChecklist'],
					},
				},
				description:
					'Template ID to base the checklist on - must exist in templates table (optional)',
			},
			{
				displayName: 'Complete Steps Order',
				name: 'completeStepsOrder',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['createChecklist'],
					},
				},
				description: 'Completion order: same or individual (optional)',
			},
			{
				displayName: 'Checklist ID',
				name: 'checklistId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['deleteChecklist'],
					},
				},
				description: 'Checklist ID to delete (required)',
			},
			{
				displayName: 'Step ID',
				name: 'stepId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['toggleChecklistStep'],
					},
				},
				description: 'Step ID to toggle (required)',
			},
			{
				displayName: 'Complete Sub Steps',
				name: 'completeSubSteps',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['toggleChecklistStep'],
					},
				},
				description:
					'Also mark all sub-steps as complete when completing the main step (optional, default: false)',
			},
			{
				displayName: 'Checklist ID',
				name: 'checklistId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['addChecklistSection'],
					},
				},
				description: 'Checklist ID to add section to (required)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['addChecklistSection'],
					},
				},
				description: 'Section name (required)',
			},
			{
				displayName: 'Checklist ID',
				name: 'checklistId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['addChecklistStep'],
					},
				},
				description: 'Checklist ID to add step to (required)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['addChecklistStep'],
					},
				},
				description: 'Step name (required)',
			},
			{
				displayName: 'Section ID',
				name: 'sectionId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['addChecklistStep'],
					},
				},
				description:
					'Section ID to add step to (optional, if not provided step goes directly under checklist)',
			},
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['addChecklistStep'],
					},
				},
				description: 'Detailed instructions for completing the step (optional)',
			},
			{
				displayName: 'Link',
				name: 'link',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['addChecklistStep'],
					},
				},
				description: 'URL link related to the step (optional)',
			},
			{
				displayName: 'Parent Step ID',
				name: 'parentStepId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['checklists'],
						operation: ['addChecklistStep'],
					},
				},
				description: 'Parent step ID to create a sub-step (optional)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['comments'],
					},
				},
				options: [
					{
						name: 'Get Comments',
						value: 'getComments',
						description:
							'Retrieve comments for a specific object type and ID. Uses the existing CommentController getIndex method to fetch comments with proper visibility filtering based on user role. Returns comment data using CommentResource format.',
						action: 'Get Comments',
					},
				],
				default: 'getComments',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['comments'],
						operation: ['getComments'],
					},
				},
				description:
					'Object type to get comments for (required): task, project, step, deal, organization, contact, subscription, timeMaterial, supportTask, subscriptionTask',
			},
			{
				displayName: 'Object ID',
				name: 'objectId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['comments'],
						operation: ['getComments'],
					},
				},
				description: 'ID of the object to get comments for (required) - must be a positive integer',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['commissions'],
					},
				},
				options: [
					{
						name: 'Get Commission Periods',
						value: 'getCommissionPeriods',
						description:
							"Retrieve all available commission periods for the company. Returns predefined periods and includes a 'custom' period option for date range selection.",
						action: 'Get Commission Periods',
					},
					{
						name: 'Get Commissions',
						value: 'getCommissions',
						description:
							'Get commission data for a specific period. Supports both predefined periods and custom date ranges. Returns summary data with user commissions including actual, forecasted, and total amounts with trend comparison.',
						action: 'Get Commissions',
					},
				],
				default: 'getCommissionPeriods',
			},
			{
				displayName: 'Period ID',
				name: 'periodId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['commissions'],
						operation: ['getCommissions'],
					},
				},
				description:
					"Commission period ID (required) - use 'custom' for custom date range or get valid IDs from getCommissionPeriods",
			},
			{
				displayName: 'Date Range',
				name: 'dateRange',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['commissions'],
						operation: ['getCommissions'],
					},
				},
				description:
					"Date range in YYYY-MM-DD||YYYY-MM-DD format (required when periodId is 'custom', optional otherwise)",
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contacts'],
					},
				},
				options: [
					{
						name: 'Tag Contact',
						value: 'tagContact',
						description: 'Tags a contact with the given label',
						action: 'Tag Contact',
					},
					{
						name: 'Add Note',
						value: 'addNote',
						description: 'Adds a note to a contact',
						action: 'Add Note',
					},
					{
						name: 'Remove Contact Tag',
						value: 'removeContactTag',
						description: 'Removes a tag from the given contact',
						action: 'Remove Contact Tag',
					},
					{
						name: 'Find Contacts',
						value: 'findContacts',
						description: 'Searches contacts by ID, name, or email',
						action: 'Find Contacts',
					},
					{
						name: 'Create Contact',
						value: 'createContact',
						description: 'Creates a new contact under an existing organization',
						action: 'Create Contact',
					},
				],
				default: 'tagContact',
			},
			{
				displayName: 'Contact',
				name: 'contact',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['tagContact'],
					},
				},
				description: 'The contact identifier',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['tagContact'],
					},
				},
				description: 'The tag to apply',
			},
			{
				displayName: 'Contact',
				name: 'contact',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['addNote'],
					},
				},
				description: 'The contact identifier',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['addNote'],
					},
				},
				description: 'The content of the note',
			},
			{
				displayName: 'Contact',
				name: 'contact',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['removeContactTag'],
					},
				},
				description: 'The contact identifier',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['removeContactTag'],
					},
				},
				description: 'The tag to remove',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['findContacts'],
					},
				},
				description: 'Search term (ID, name, or email)',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['findContacts'],
					},
				},
				description: 'Search type: id, name, or email (default: name)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['createContact'],
					},
				},
				description: 'Organization ID (required)',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['createContact'],
					},
				},
				description: 'Contact first name (required)',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['createContact'],
					},
				},
				description: 'Contact last name (required)',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['createContact'],
					},
				},
				description: 'Contact title or position',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['createContact'],
					},
				},
				description: 'Contact status ID (optional)',
			},
			{
				displayName: 'Phones',
				name: 'phones',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['createContact'],
					},
				},
				description: 'A phone numbers',
			},
			{
				displayName: 'Emails',
				name: 'emails',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['createContact'],
					},
				},
				description: 'A email address',
			},
			{
				displayName: 'Time Zone',
				name: 'timeZone',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['createContact'],
					},
				},
				description: 'Time zone for the contact',
			},
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['contacts'],
						operation: ['createContact'],
					},
				},
				description: 'Contact owner user ID',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['deals'],
					},
				},
				options: [
					{
						name: 'Find Deals',
						value: 'findDeals',
						description:
							'Retrieves deals linked to organizations with comprehensive filtering options',
						action: 'Find Deals',
					},
					{
						name: 'Get Deal Details',
						value: 'getDeal',
						description: 'Fetches detailed information about a specific deal by ID',
						action: 'Get Deal Details',
					},
					{
						name: 'Create Deal',
						value: 'createDeal',
						description:
							'Create a new deal for an organization. NOTE: The organization must have at least one contact before creating a deal. Use createContact if needed. A valid boardName is required - use getDealBoards to get available board names.',
						action: 'Create Deal',
					},
					{
						name: 'Change Deal Status',
						value: 'changeDealStatus',
						description: 'Changes the status of a deal',
						action: 'Change Deal Status',
					},
					{
						name: 'Change Deal Owner',
						value: 'changeDealOwner',
						description: 'Changes the owner of a deal',
						action: 'Change Deal Owner',
					},
					{
						name: 'Change Deal Stage',
						value: 'changeDealStage',
						description:
							'Change the stage of an existing deal. Use getDealStages to get available stages for a specific board.',
						action: 'Change Deal Stage',
					},
					{
						name: 'Get Deal Boards',
						value: 'getDealBoards',
						description: 'Retrieve all available deal boards with their stages.',
						action: 'Get Deal Boards',
					},
					{
						name: 'Get Deal Stages',
						value: 'getDealStages',
						description:
							'Retrieve deal stages with optional filtering by company ID and/or board ID.',
						action: 'Get Deal Stages',
					},
				],
				default: 'findDeals',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['findDeals'],
					},
				},
				description: 'Organization ID to filter deals (optional)',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['findDeals'],
					},
				},
				description: 'Search term to match deal names (optional)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['findDeals'],
					},
				},
				description: 'Deal status: in_progress, won, lost (optional)',
			},
			{
				displayName: 'Board ID',
				name: 'boardId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['findDeals'],
					},
				},
				description: 'Deal board ID to filter by (optional)',
			},
			{
				displayName: 'Stage ID',
				name: 'stageId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['findDeals'],
					},
				},
				description: 'Deal stage ID to filter by (optional)',
			},
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['findDeals'],
					},
				},
				description: 'Deal owner user ID to filter by (optional)',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['findDeals'],
					},
				},
				description: 'Filter by deal creation start date (YYYY-MM-DD) (optional)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['findDeals'],
					},
				},
				description: 'Filter by deal creation end date (YYYY-MM-DD) (optional)',
			},
			{
				displayName: 'Deal ID',
				name: 'dealId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['getDeal'],
					},
				},
				description: 'Deal ID to retrieve',
			},
			{
				displayName: 'Deal Name',
				name: 'name',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description: 'Deal name (required)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description: 'Organization ID (required)',
			},
			{
				displayName: 'Board Name',
				name: 'boardName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description: 'Deal board name (required) - use getDealBoards to get available board names',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description:
					'Deal value/amount (optional) - defaults to 0 if not provided and noValue is false',
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description: 'Contact ID (optional)',
			},
			{
				displayName: 'Stage Name',
				name: 'stageName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description:
					'Deal stage name (optional) - if not provided, uses first stage of the specified board. Use getDealStages to see available stage names for a board',
			},
			{
				displayName: 'Owner Name',
				name: 'ownerName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description:
					'Deal owner full name in the format "First Last" (optional). If provided, the user is looked up by first and last name; if not found, the system rep ID is used. If omitted, defaults to organization owner or system rep ID. For backward compatibility, ownerId is still accepted.',
			},
			{
				displayName: 'Owner ID',
				name: 'ownerId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description:
					'Deal owner user ID (optional) - defaults to organization owner or system rep ID. For backward compatibility only, prefer using ownerName.',
			},
			{
				displayName: 'Expected Closed',
				name: 'expectedClosed',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description: 'Expected close date as Unix timestamp (optional)',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description: 'Deal interval: one time, monthly, quarterly, yearly (optional)',
			},
			{
				displayName: 'No Value',
				name: 'noValue',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['createDeal'],
					},
				},
				description: 'Boolean flag indicating if deal has no monetary value (optional)',
			},
			{
				displayName: 'Deal',
				name: 'deal',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['changeDealStatus'],
					},
				},
				description: 'The deal identifier',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['changeDealStatus'],
					},
				},
				description:
					"The new status for the deal ('in_progress', 'won', 'lost', 'deleted', 'reopen')",
			},
			{
				displayName: 'Lost Explain',
				name: 'lostExplain',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['changeDealStatus'],
					},
				},
				description: "Explanation for lost status (required when status is 'lost')",
			},
			{
				displayName: 'Deal',
				name: 'deal',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['changeDealOwner'],
					},
				},
				description: 'The deal identifier',
			},
			{
				displayName: 'Owner',
				name: 'owner',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['changeDealOwner'],
					},
				},
				description: 'The user ID of the new owner',
			},
			{
				displayName: 'Deal ID',
				name: 'dealId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['changeDealStage'],
					},
				},
				description: 'Deal ID to update',
			},
			{
				displayName: 'Stage ID',
				name: 'stageId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['changeDealStage'],
					},
				},
				description: 'New stage ID (required) - use getDealStages to get available stages',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['getDealStages'],
					},
				},
				description: 'Company ID to filter stages by',
			},
			{
				displayName: 'Board ID',
				name: 'boardId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['deals'],
						operation: ['getDealStages'],
					},
				},
				description: 'Deal board ID to filter stages by',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['financial'],
					},
				},
				options: [
					{
						name: 'Get Transactions',
						value: 'getTransactions',
						description:
							'Retrieve financial transactions for a specific organization with comprehensive filtering options. Returns transaction data using TransactionResource format with payment details, status, and related project/subscription information.',
						action: 'Get Transactions',
					},
				],
				default: 'getTransactions',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['financial'],
						operation: ['getTransactions'],
					},
				},
				description:
					'Organization ID to retrieve transactions for (required) - use searchOrganizations to find valid organization IDs',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['financial'],
						operation: ['getTransactions'],
					},
				},
				description: 'Filter by transaction status: paid, closed, failed (optional)',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['financial'],
						operation: ['getTransactions'],
					},
				},
				description: 'Filter by transaction type: subscription, project, one-time (optional)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ideas'],
					},
				},
				options: [
					{
						name: 'List Ideas',
						value: 'listIdeas',
						description:
							'Retrieve and search ideas from the idea management system with vote counts, resolution status, and category information. Supports filtering by search, status, and resolution.',
						action: 'List Ideas',
					},
					{
						name: 'Vote Idea',
						value: 'voteIdea',
						description:
							'Vote or unvote on an idea. If user has already voted, removes the vote. If not voted, adds a vote. Returns updated idea with current vote count.',
						action: 'Vote Idea',
					},
					{
						name: 'Create Idea',
						value: 'createIdea',
						description:
							'Create a new idea in the idea management system. Ideas can be used for feature requests, suggestions, or feedback. Automatically adds creator as first voter.',
						action: 'Create Idea',
					},
					{
						name: 'Add Idea Comment',
						value: 'addIdeaComment',
						description:
							'Add a comment to an idea. Comments can be public, private, or internal notes. Marking a comment as resolved will also mark the idea as resolved.',
						action: 'Add Idea Comment',
					},
					{
						name: 'Get Idea Categories',
						value: 'getIdeaCategories',
						description: 'Retrieve all available idea categories.',
						action: 'Get Idea Categories',
					},
				],
				default: 'listIdeas',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['listIdeas'],
					},
				},
				description: 'Search term to match idea titles and descriptions (optional)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['listIdeas'],
					},
				},
				description: 'Filter by idea status: public or private (optional)',
			},
			{
				displayName: 'Resolved',
				name: 'resolved',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['listIdeas'],
					},
				},
				description:
					'Filter by resolution status: true for resolved, false for unresolved (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['listIdeas'],
					},
				},
				description: 'Maximum number of results to return (optional, max 100, default 50)',
			},
			{
				displayName: 'Idea ID',
				name: 'ideaId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['voteIdea'],
					},
				},
				description: 'Idea ID to vote on (required)',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['createIdea'],
					},
				},
				description: 'Idea title (required)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['createIdea'],
					},
				},
				description: 'Detailed description of the idea (optional)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['createIdea'],
					},
				},
				description: 'Idea status: public or private (optional, defaults to public)',
			},
			{
				displayName: 'Categories',
				name: 'categories',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['createIdea'],
					},
				},
				description: 'Array of category IDs to assign to the idea (optional)',
			},
			{
				displayName: 'Idea ID',
				name: 'ideaId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['addIdeaComment'],
					},
				},
				description: 'Idea ID to comment on (required)',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['addIdeaComment'],
					},
				},
				description: 'Comment text (required)',
			},
			{
				displayName: 'Resolved',
				name: 'resolved',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['addIdeaComment'],
					},
				},
				description: 'Mark this comment as resolving the idea (optional, defaults to false)',
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['ideas'],
						operation: ['addIdeaComment'],
					},
				},
				description:
					'Comment visibility: public, private, or internalNote (optional, defaults to public)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['knowledge-base'],
					},
				},
				options: [
					{
						name: 'Search Knowledge Base',
						value: 'searchKnowledgeBase',
						description: 'Search knowledge base articles by query string.',
						action: 'Search Knowledge Base',
					},
					{
						name: 'Get Knowledge Base Article',
						value: 'getKnowledgeBaseArticle',
						description: 'Retrieve a specific knowledge base article by ID.',
						action: 'Get Knowledge Base Article',
					},
					{
						name: 'Get Knowledge Base Categories',
						value: 'getKnowledgeBaseCategories',
						description: 'Retrieve all knowledge base categories.',
						action: 'Get Knowledge Base Categories',
					},
					{
						name: 'AI Knowledge Base Search',
						value: 'getAiKbSearch',
						description:
							'Search knowledge base articles using AI-powered vector search based on semantic similarity. Returns results ranked by relevance to the query.',
						action: 'AI Knowledge Base Search',
					},
				],
				default: 'searchKnowledgeBase',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['knowledge-base'],
						operation: ['searchKnowledgeBase'],
					},
				},
				description: 'Search term to find in article titles and content',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['knowledge-base'],
						operation: ['searchKnowledgeBase'],
					},
				},
				description: 'Maximum number of results to return (max 50, default 10)',
			},
			{
				displayName: 'Article ID',
				name: 'articleId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['knowledge-base'],
						operation: ['getKnowledgeBaseArticle'],
					},
				},
				description: 'Knowledge base article ID to retrieve',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['knowledge-base'],
						operation: ['getAiKbSearch'],
					},
				},
				description: 'Search query for semantic matching in knowledge base articles',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['knowledge-base'],
						operation: ['getAiKbSearch'],
					},
				},
				description: 'Maximum number of results to return (optional, default: 5)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
					},
				},
				options: [
					{
						name: 'Get Marketing Board Items',
						value: 'getMarketingBoardItems',
						description:
							'Search and retrieve marketing board items from the sb_items table with comprehensive filtering options. Returns name, organization, board name, contact ID, assigned to, created by, progress, status, due date and created at.',
						action: 'Get Marketing Board Items',
					},
				],
				default: 'getMarketingBoardItems',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description: 'Search term to match item names or organization names (optional)',
			},
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description:
					'Filter by assigned user ID - use searchUsers to find valid user IDs (optional)',
			},
			{
				displayName: 'Created At',
				name: 'created_at',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description: 'Filter by creation date in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description: 'Filter by item status: Pending, Active, Delivered, Overdue (optional)',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description: 'Filter by exact due date in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Due Date Greater Than',
				name: 'due_date_gt',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description:
					'Filter by due date greater than specified date in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Due Date Greater Than Equal',
				name: 'due_date_gte',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description:
					'Filter by due date greater than or equal to specified date in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Due Date Less Than',
				name: 'due_date_lt',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description: 'Filter by due date less than specified date in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Due Date Less Than Equal',
				name: 'due_date_lte',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description:
					'Filter by due date less than or equal to specified date in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Due Date From',
				name: 'due_date_from',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description:
					'Filter by due date from specified date (start of range) in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Due Date To',
				name: 'due_date_to',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description:
					'Filter by due date to specified date (end of range) in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Organization ID',
				name: 'org_id',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description:
					'Filter by organization ID - use searchOrganizations to find valid organization IDs (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['marketing-board'],
						operation: ['getMarketingBoardItems'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['organizations'],
					},
				},
				options: [
					{
						name: 'Remove Organization Tag',
						value: 'removeOrganizationTag',
						description: 'Removes a tag from the given organization',
						action: 'Remove Organization Tag',
					},
					{
						name: 'Tag Organization',
						value: 'tagOrganization',
						description: 'Tags an organization with the given label',
						action: 'Tag Organization',
					},
					{
						name: 'Find Organizations',
						value: 'findOrganizations',
						description: 'Searches organizations by name, email, or phone',
						action: 'Find Organizations',
					},
					{
						name: 'Search Multiple Organizations',
						value: 'searchMultipleOrganizations',
						description:
							'Search for multiple organizations by exact names (case-insensitive). Searches for organizations that exactly match the provided names, ignoring case differences. Returns results grouped by searched name with found/not found status.',
						action: 'Search Multiple Organizations',
					},
					{
						name: 'Search Organizations With Meta',
						value: 'searchOrganizationsWithMeta',
						description:
							'Search organizations by name or phone number using contact meta data. Searches organization names and contact phone numbers stored in meta data for matches.',
						action: 'Search Organizations With Meta',
					},
					{
						name: 'Create Organization',
						value: 'createOrganization',
						description:
							'Create a new organization with optional contact creation. Simplified interface with essential fields only.',
						action: 'Create Organization',
					},
					{
						name: 'Get Organization Statuses',
						value: 'getOrganizationStatuses',
						description: 'Retrieve all available organization statuses.',
						action: 'Get Organization Statuses',
					},
					{
						name: 'Get Organization',
						value: 'getOrganization',
						description:
							'Retrieve detailed information about a specific organization by ID with conditional loading for performance. Returns comprehensive organization data including contacts, activities, subscriptions, projects, deals, invoices, transactions, support tickets, and all related information based on the flags provided.',
						action: 'Get Organization',
					},
					{
						name: 'Add Organization Note',
						value: 'addOrganizationNote',
						description: 'Adds a note to a contact',
						action: 'Add Organization Note',
					},
				],
				default: 'removeOrganizationTag',
			},
			{
				displayName: 'Organization',
				name: 'organization',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['removeOrganizationTag'],
					},
				},
				description: 'The organization identifier',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['removeOrganizationTag'],
					},
				},
				description: 'The tag to remove',
			},
			{
				displayName: 'Tag',
				name: 'untagAllContacts',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['removeOrganizationTag'],
					},
				},
				description: 'if also need to untag all the contacts',
			},
			{
				displayName: 'Organization',
				name: 'organization',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['tagOrganization'],
					},
				},
				description: 'The organization identifier',
			},
			{
				displayName: 'Tag',
				name: 'tag',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['tagOrganization'],
					},
				},
				description: 'The tag to apply',
			},
			{
				displayName: 'Tag',
				name: 'tagAllContacts',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['tagOrganization'],
					},
				},
				description: 'also tag all the contacts',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['findOrganizations'],
					},
				},
				description: 'Search term (name, email, or phone)',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['findOrganizations'],
					},
				},
				description: 'Search type: name, email, or phone',
			},
			{
				displayName: 'Find',
				name: 'find',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['searchOrganizationsWithMeta'],
					},
				},
				description: 'Search term to find organizations by name or contact phone number (required)',
			},
			{
				displayName: 'Organization Name',
				name: 'name',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['createOrganization'],
					},
				},
				description: 'Organization name (required)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['createOrganization'],
					},
				},
				description: 'Organization status (optional - uses first available status if not provided)',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['createOrganization'],
					},
				},
				description: 'Currency code (optional)',
			},
			{
				displayName: 'Owner',
				name: 'owner',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['createOrganization'],
					},
				},
				description: 'Owner user ID or email address (optional)',
			},
			{
				displayName: 'Is Contact',
				name: 'isContact',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['createOrganization'],
					},
				},
				description: 'Boolean to create contact with organization (optional)',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['createOrganization'],
					},
				},
				description: 'Contact first name (required if isContact=true)',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['createOrganization'],
					},
				},
				description: 'Contact last name (required if isContact=true)',
			},
			{
				displayName: 'Phone',
				name: 'phones',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['createOrganization'],
					},
				},
				description: 'string of phone number',
			},
			{
				displayName: 'Email',
				name: 'emails',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['createOrganization'],
					},
				},
				description: 'string of email address',
			},
			{
				displayName: 'Organization ID',
				name: 'organizationId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description: 'Organization ID to retrieve detailed information for',
			},
			{
				displayName: 'Projects',
				name: 'projects',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description: 'Include organization projects with stage and board information (optional)',
			},
			{
				displayName: 'Deals',
				name: 'deals',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description:
					'Include organization deals with stage, board, owner, and contact information, plus active deals (optional)',
			},
			{
				displayName: 'Subscriptions',
				name: 'subscriptions',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description: 'Include organization subscriptions and active subscriptions (optional)',
			},
			{
				displayName: 'Tickets',
				name: 'tickets',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description:
					'Include organization support tickets with channel, category, and assigned user information - limited to 10 most recent (optional)',
			},
			{
				displayName: 'Transactions',
				name: 'transactions',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description:
					'Include organization financial transactions - limited to 10 most recent, ordered by payment_time desc (optional)',
			},
			{
				displayName: 'Invoices',
				name: 'invoices',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description:
					'Include organization invoices - limited to 10 most recent, ordered by invoice_date desc (optional)',
			},
			{
				displayName: 'Work Orders',
				name: 'workorders',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description: 'Include organization work orders - limited to 10 most recent (optional)',
			},
			{
				displayName: 'Orders',
				name: 'orders',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description: 'Include organization orders - limited to 10 most recent (optional)',
			},
			{
				displayName: 'Activities',
				name: 'activities',
				type: 'boolean',
				default: false,
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['getOrganization'],
					},
				},
				description:
					'Include organization recent activities - limited to 25 most recent (optional)',
			},
			{
				displayName: 'Org ID',
				name: 'orgId',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['addOrganizationNote'],
					},
				},
				description: 'The organization ID',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['organizations'],
						operation: ['addOrganizationNote'],
					},
				},
				description: 'The content of the note',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['projects'],
					},
				},
				options: [
					{
						name: 'Change Project Stage',
						value: 'changeProjectStage',
						description: 'Change the stage of an existing project.',
						action: 'Change Project Stage',
					},
					{
						name: 'Create Project',
						value: 'createProject',
						description:
							'Create a new project for an organization. NOTE: The organization must have at least one contact before creating a project. Use createContact if needed. A valid boardId is required - use getProjectBoards to get available boards.',
						action: 'Create Project',
					},
					{
						name: 'Get Project Templates',
						value: 'getProjectTemplates',
						description: 'Retrieve all available project templates.',
						action: 'Get Project Templates',
					},
					{
						name: 'Update Project Assignments',
						value: 'updateProjectAssignments',
						description:
							'Update sales rep and/or account manager assignments for an existing project. At least one of accountManager or salesRep must be provided.',
						action: 'Update Project Assignments',
					},
					{
						name: 'Change Project Status',
						value: 'changeProjectStatus',
						description:
							'Change the status of an existing project. Supports active, completed, and cancelled statuses.',
						action: 'Change Project Status',
					},
					{
						name: 'Archive Project',
						value: 'archiveProject',
						description:
							'Archive or unarchive a project. Archived projects are hidden from main project lists but remain accessible.',
						action: 'Archive Project',
					},
					{
						name: 'Find Projects',
						value: 'findProjects',
						description:
							'Get projects linked to organizations with optional filtering. If no orgId provided, returns all projects.',
						action: 'Find Projects',
					},
					{
						name: 'Get Project Details',
						value: 'getProject',
						description: 'Fetches detailed information about a specific project by ID',
						action: 'Get Project Details',
					},
					{
						name: 'Get Project Boards',
						value: 'getProjectBoards',
						description: 'Retrieve all available project boards with their stages.',
						action: 'Get Project Boards',
					},
					{
						name: 'Get Project Stages',
						value: 'getProjectStages',
						description:
							'Retrieve project stages with optional filtering by company ID and/or board ID.',
						action: 'Get Project Stages',
					},
					{
						name: 'Search Project Services',
						value: 'searchProjectServices',
						description:
							'Search project services with comprehensive filtering options. Filter by type, frequency, import type, currency, active status, and taxable status.',
						action: 'Search Project Services',
					},
				],
				default: 'changeProjectStage',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['changeProjectStage'],
					},
				},
				description: 'Project ID to update',
			},
			{
				displayName: 'Stage ID',
				name: 'stageId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['changeProjectStage'],
					},
				},
				description: 'New stage ID',
			},
			{
				displayName: 'Project Title',
				name: 'title',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description: 'Project title (required)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description: 'Organization ID (required)',
			},
			{
				displayName: 'Board ID',
				name: 'boardId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description: 'Project board ID (required) - use getProjectBoards to get available boards',
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description: 'Contact ID (optional)',
			},
			{
				displayName: 'Stage ID',
				name: 'stageId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description:
					'Project stage ID (optional) - if not provided, uses first stage of the specified board',
			},
			{
				displayName: 'Account Manager',
				name: 'accountManager',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description: 'Account manager user ID (optional)',
			},
			{
				displayName: 'Sales Rep',
				name: 'salesRep',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description: 'Sales representative user ID (optional)',
			},
			{
				displayName: 'Hours',
				name: 'hours',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description: 'Estimated hours for the project (optional)',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description:
					'Project template ID (optional) - use getProjectTemplates to get available templates',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['createProject'],
					},
				},
				description: 'Project description (optional)',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['updateProjectAssignments'],
					},
				},
				description: 'Project ID to update (required)',
			},
			{
				displayName: 'Account Manager',
				name: 'accountManager',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['updateProjectAssignments'],
					},
				},
				description: 'Account manager user ID (optional) - use searchUsers to find valid user IDs',
			},
			{
				displayName: 'Sales Rep',
				name: 'salesRep',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['updateProjectAssignments'],
					},
				},
				description:
					'Sales representative user ID (optional) - use searchUsers to find valid user IDs',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['changeProjectStatus'],
					},
				},
				description: 'Project ID to update (required)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['changeProjectStatus'],
					},
				},
				description: 'New project status (required): active, completed, cancelled',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['archiveProject'],
					},
				},
				description: 'Project ID to archive/unarchive (required)',
			},
			{
				displayName: 'Archive',
				name: 'archive',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['archiveProject'],
					},
				},
				description: 'Boolean flag: true to archive, false to unarchive (required)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['findProjects'],
					},
				},
				description: 'Organization ID to filter projects (optional)',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['findProjects'],
					},
				},
				description: 'Search term to match project titles (optional)',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['findProjects'],
					},
				},
				description: 'Filter by project start date (YYYY-MM-DD format, optional)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['findProjects'],
					},
				},
				description: 'Filter by project end date (YYYY-MM-DD format, optional)',
			},
			{
				displayName: 'Completed At',
				name: 'completedAt',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['findProjects'],
					},
				},
				description: 'Filter by project completion date (YYYY-MM-DD format, optional)',
			},
			{
				displayName: 'Account Manager',
				name: 'accountManager',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['findProjects'],
					},
				},
				description:
					'Account manager user ID(s) to filter projects assigned to this account manager. Accepts a single ID or an array of IDs (optional) - use searchUsers to find valid user IDs',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 5,
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['findProjects'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 5)',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['getProject'],
					},
				},
				description: 'Project ID to retrieve',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['getProjectStages'],
					},
				},
				description: 'Company ID to filter stages by',
			},
			{
				displayName: 'Board ID',
				name: 'boardId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['getProjectStages'],
					},
				},
				description: 'Project board ID to filter stages by',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['searchProjectServices'],
					},
				},
				description: 'Service type: project, marketing, etc. (optional)',
			},
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['searchProjectServices'],
					},
				},
				description: 'Service frequency: one time, monthly, quarterly, yearly, etc. (optional)',
			},
			{
				displayName: 'Import Type',
				name: 'import_type',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['searchProjectServices'],
					},
				},
				description: 'Import type identifier (optional)',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['searchProjectServices'],
					},
				},
				description: 'Currency code (optional)',
			},
			{
				displayName: 'Active',
				name: 'active',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['searchProjectServices'],
					},
				},
				description: 'Filter by active status: true or false (optional)',
			},
			{
				displayName: 'Taxable',
				name: 'taxable',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['searchProjectServices'],
					},
				},
				description: 'Filter by taxable status: true or false (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['projects'],
						operation: ['searchProjectServices'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['proposals'],
					},
				},
				options: [
					{
						name: 'Search Proposals',
						value: 'searchProposals',
						description:
							'Search proposals with comprehensive filtering options. Filter by organization, status, creation date, and assignment date (signed_at).',
						action: 'Search Proposals',
					},
					{
						name: 'Get Proposal Templates',
						value: 'proposalTemplates',
						description:
							'Retrieve proposal templates with basic filtering options. Returns id, name, and status for each template.',
						action: 'Get Proposal Templates',
					},
					{
						name: 'Create Proposal',
						value: 'createProposal',
						description:
							'Create a new proposal for an organization using a template and custom products. Creates a draft proposal that can be sent later.',
						action: 'Create Proposal',
					},
					{
						name: 'Get Proposal Template',
						value: 'getProposalTemplate',
						description:
							'Retrieve a specific proposal template by ID with full details including template data, folder information, creator details, and preview URL.',
						action: 'Get Proposal Template',
					},
				],
				default: 'searchProposals',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['searchProposals'],
					},
				},
				description: 'Organization ID to filter proposals (optional)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['searchProposals'],
					},
				},
				description:
					'Filter by proposal status: draft, sent, viewed, accepted, archived (optional)',
			},
			{
				displayName: 'Created At',
				name: 'created_at',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['searchProposals'],
					},
				},
				description: 'Filter by creation date in YYYY-MM-DD format or Unix timestamp (optional)',
			},
			{
				displayName: 'Assigned At',
				name: 'assigned_at',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['searchProposals'],
					},
				},
				description:
					'Filter by assignment/signed date in YYYY-MM-DD format or Unix timestamp (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['searchProposals'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['proposalTemplates'],
					},
				},
				description:
					'Filter by template status: publish, unpublish, all (optional, default: publish)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['proposalTemplates'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['createProposal'],
					},
				},
				description: 'Proposal title (required)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['createProposal'],
					},
				},
				description:
					'Organization ID (required) - use searchOrganizations to find valid organization IDs',
			},
			{
				displayName: 'Signer IDs',
				name: 'signerIds',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['createProposal'],
					},
				},
				description:
					'String of contact IDs who can sign the proposal (required) Qoma Seperated - subset of contactIds',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['createProposal'],
					},
				},
				description:
					'Proposal template ID to base the proposal on (required) - use proposalTemplates to get available template IDs',
			},
			{
				displayName: 'Address ID',
				name: 'addressId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['createProposal'],
					},
				},
				description: 'Organization address ID (optional)',
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['proposals'],
						operation: ['getProposalTemplate'],
					},
				},
				description:
					'Proposal template ID to retrieve (required) - use proposalTemplates to get available template IDs',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['reviews'],
					},
				},
				options: [
					{
						name: 'Get Reviews',
						value: 'getReviews',
						description:
							'Retrieve reviews with comprehensive filtering options. Returns paginated review data using CompactReviewResource format from the existing ReviewController.',
						action: 'Get Reviews',
					},
				],
				default: 'getReviews',
			},
			{
				displayName: 'After',
				name: 'after',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['reviews'],
						operation: ['getReviews'],
					},
				},
				description: 'Unix timestamp to filter reviews created after this date (optional)',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['reviews'],
						operation: ['getReviews'],
					},
				},
				description: 'Search term to match review content (optional)',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['reviews'],
						operation: ['getReviews'],
					},
				},
				description: 'Filter by review type/module (optional)',
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['reviews'],
						operation: ['getReviews'],
					},
				},
				description: 'Sort order: asc or desc (optional, default: desc)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['reviews'],
						operation: ['getReviews'],
					},
				},
				description: 'Maximum number of results per page (optional, max 100, default 50)',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['reviews'],
						operation: ['getReviews'],
					},
				},
				description: 'Page number for pagination (optional, default 1)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
					},
				},
				options: [
					{
						name: 'Get Subscriptions',
						value: 'getSubscriptions',
						description:
							'Search organization subscriptions with comprehensive filtering options. Filter by organization ID, cycle, status, start date, payment method, and sales rep.',
						action: 'Get Subscriptions',
					},
				],
				default: 'getSubscriptions',
			},
			{
				displayName: 'Organization ID',
				name: 'organization_id',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['getSubscriptions'],
					},
				},
				description: 'Organization ID to filter subscriptions (optional)',
			},
			{
				displayName: 'Cycle',
				name: 'cycle',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['getSubscriptions'],
					},
				},
				description: 'Subscription cycle: monthly, quarterly, yearly, etc. (optional)',
			},
			{
				displayName: 'Subscription Status',
				name: 'subscription_status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['getSubscriptions'],
					},
				},
				description: 'Subscription status: active, cancelled, paused (optional)',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['getSubscriptions'],
					},
				},
				description: 'Filter by subscription start date in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Month',
				name: 'month',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['getSubscriptions'],
					},
				},
				description: 'Filter by start date month (1-12) (optional)',
			},
			{
				displayName: 'Year',
				name: 'year',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['getSubscriptions'],
					},
				},
				description: 'Filter by start date year (optional)',
			},
			{
				displayName: 'Payment Method',
				name: 'payment_method',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['getSubscriptions'],
					},
				},
				description: 'Payment method type/brand to filter by (optional)',
			},
			{
				displayName: 'Sales Rep',
				name: 'sales_rep',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['getSubscriptions'],
					},
				},
				description: 'Sales representative user ID to filter by (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['subscriptions'],
						operation: ['getSubscriptions'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['support'],
					},
				},
				options: [
					{
						name: 'Get Support Tickets',
						value: 'getSupportTickets',
						description:
							'Retrieve support tickets with optional filtering by status, category, channel, and search terms. Supports pagination for managing large ticket volumes.',
						action: 'Get Support Tickets',
					},
					{
						name: 'Get Support Ticket',
						value: 'getSupportTicket',
						description:
							'Retrieve detailed information about a specific support ticket by ID, including ticket history, comments, and attachments.',
						action: 'Get Support Ticket',
					},
					{
						name: 'Get Support Ticket Messages',
						value: 'getSupportTicketMessages',
						description:
							'Retrieve ticket messages for a specific support ticket by ID, including comments and attachments.',
						action: 'Get Support Ticket Messages',
					},
					{
						name: 'Get Support Ticket Task Details',
						value: 'getSupportTicketTaskDetails',
						description:
							'Retrieve ticket messages for a specific support ticket by ID, including comments and attachments.',
						action: 'Get Support Ticket Task Details',
					},
					{
						name: 'Add Summary to Support Ticket',
						value: 'addSummaryToSupportTicket',
						description: 'Add summary to a specific support ticket by ID.',
						action: 'Add Summary to Support Ticket',
					},
					{
						name: 'Add Draft Reply to Support Ticket',
						value: 'addDraftReplyToSupportTicket',
						description: 'Add draft reply (HTML content) to a specific support ticket by ID.',
						action: 'Add Draft Reply to Support Ticket',
					},
					{
						name: 'Create Support Ticket',
						value: 'createSupportTicket',
						description: 'Create a new support ticket with details.',
						action: 'Create Support Ticket',
					},
					{
						name: 'Get Support Channels',
						value: 'getSupportChannels',
						description:
							'Retrieve all available support channels (email, phone, chat, etc.). Use these IDs when creating or filtering support tickets.',
						action: 'Get Support Channels',
					},
					{
						name: 'Get Support Categories',
						value: 'getSupportCategories',
						description:
							'Retrieve all available support categories for ticket classification. Use these IDs when creating or filtering support tickets.',
						action: 'Get Support Categories',
					},
					{
						name: 'Get Support Statuses',
						value: 'getSupportStatuses',
						description:
							'Retrieve all available support ticket statuses (open, pending, resolved, closed, etc.). Use these values when filtering support tickets.',
						action: 'Get Support Statuses',
					},
					{
						name: 'Reply to Ticket',
						value: 'ticketReply',
						description:
							'Reply to an existing support ticket. Can be used to add responses or internal notes to tickets.',
						action: 'Reply to Ticket',
					},
				],
				default: 'getSupportTickets',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTickets'],
					},
				},
				description: 'Search term to match ticket subjects and content (optional)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTickets'],
					},
				},
				description:
					'Filter by ticket status - use getSupportStatuses to get available options (optional)',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTickets'],
					},
				},
				description:
					'Filter by support category ID - use getSupportCategories to get available options (optional)',
			},
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTickets'],
					},
				},
				description:
					'Filter by support channel ID - use getSupportChannels to get available options (optional)',
			},
			{
				displayName: 'Assigned To',
				name: 'assignedTo',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTickets'],
					},
				},
				description:
					'Filter by assigned user ID - use searchUsers to find valid user IDs (optional)',
			},
			{
				displayName: 'Created By',
				name: 'createdBy',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTickets'],
					},
				},
				description: 'Filter by ticket creator user ID (optional)',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTickets'],
					},
				},
				description: 'Filter by priority level: low, normal, high, urgent (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTickets'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTickets'],
					},
				},
				description: 'Page number for pagination (optional, default 1)',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTicket'],
					},
				},
				description: 'Support ticket ID to retrieve (required)',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTicketMessages'],
					},
				},
				description: 'Support ticket ID to retrieve (required)',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['getSupportTicketTaskDetails'],
					},
				},
				description: 'Support ticket ID to retrieve (required)',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['addSummaryToSupportTicket'],
					},
				},
				description: 'Support ticket ID (required)',
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['addSummaryToSupportTicket'],
					},
				},
				description: 'Summary content to add to the ticket (required)',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['addDraftReplyToSupportTicket'],
					},
				},
				description: 'Support ticket ID (required)',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['addDraftReplyToSupportTicket'],
					},
				},
				description: 'Draft reply content to add to the ticket (required)',
			},
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Support channel ID (required)',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Subject of the ticket (required)',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Detailed description/body of the issue (required)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Organization ID to associate the ticket with (optional)',
			},
			{
				displayName: 'From Email',
				name: 'from_email',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Email address of the ticket creator (optional)',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'First name of the contact (optional)',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Last name of the contact (optional)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Email for contact creation if needed (optional)',
			},
			{
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Support category ID (optional)',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Priority level (1=Low, 2=Normal, 3=High, 4=Urgent) (optional)',
			},
			{
				displayName: 'Response Type',
				name: 'responseType',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['createSupportTicket'],
					},
				},
				description: 'Response type: send or send_closed (optional)',
			},
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'number',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['ticketReply'],
					},
				},
				description: 'Support ticket ID to reply to (required)',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['support'],
						operation: ['ticketReply'],
					},
				},
				description: 'Reply message body in text format (required)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['system'],
					},
				},
				options: [
					{
						name: 'Get Info',
						value: 'info',
						description: 'Retrieve system information and available endpoints.',
						action: 'Get Info',
					},
				],
				default: 'info',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tasks'],
					},
				},
				options: [
					{
						name: 'List Tasks',
						value: 'listTasks',
						description:
							'Search and list tasks with comprehensive filtering options. Can filter by status, user assignments, organization, and search by title. Supports user lookup by email or name.',
						action: 'List Tasks',
					},
					{
						name: 'Create Task',
						value: 'createTask',
						description:
							'Create a new task with optional assignees and organization linking. Tasks can be assigned to multiple users and linked to organizations.',
						action: 'Create Task',
					},
					{
						name: 'Search Tasks',
						value: 'searchTasks',
						description:
							'Search tasks by title with comprehensive filtering options. Same as listTasks but specifically for search operations. Supports user lookup by email or name.',
						action: 'Search Tasks',
					},
					{
						name: 'Mark Task Completed',
						value: 'markTaskCompleted',
						description:
							'Mark a specific task as completed. Updates the task completion status, completion date, and records the user who completed it.',
						action: 'Mark Task Completed',
					},
				],
				default: 'listTasks',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['listTasks'],
					},
				},
				description: 'Search term to match task titles (optional)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['listTasks'],
					},
				},
				description: 'Filter by task status: pending, completed, all (optional, default: all)',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['listTasks'],
					},
				},
				description: 'Filter by user assignments - shows tasks assigned to this user (optional)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['listTasks'],
					},
				},
				description: 'User email to find and filter tasks by that user (optional)',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['listTasks'],
					},
				},
				description:
					'User first name to find and filter tasks by that user (optional, requires lastName)',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['listTasks'],
					},
				},
				description:
					'User last name to find and filter tasks by that user (optional, requires firstName)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['listTasks'],
					},
				},
				description:
					'Filter by organization ID - shows tasks linked to this organization (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['listTasks'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['createTask'],
					},
				},
				description: 'Task title (required)',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['createTask'],
					},
				},
				description: 'Task description/content (optional)',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['createTask'],
					},
				},
				description: 'Task priority level 0-5, where 5 is highest priority (optional, default: 0)',
			},
			{
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['createTask'],
					},
				},
				description: 'Due date in YYYY-MM-DD format (optional)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['createTask'],
					},
				},
				description: 'Organization ID to link the task to (optional)',
			},
			{
				displayName: 'Assignees',
				name: 'assignees',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['createTask'],
					},
				},
				description: 'ID of User to assign the task to (optional, defaults to creator if empty)',
			},
			{
				displayName: 'Parent ID',
				name: 'parentId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['createTask'],
					},
				},
				description: 'Parent task ID for creating subtasks (optional)',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['searchTasks'],
					},
				},
				description: 'Search term to match task titles (optional)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['searchTasks'],
					},
				},
				description: 'Filter by task status: pending, completed, all (optional, default: all)',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['searchTasks'],
					},
				},
				description: 'Filter by user assignments - shows tasks assigned to this user (optional)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['searchTasks'],
					},
				},
				description: 'User email to find and filter tasks by that user (optional)',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['searchTasks'],
					},
				},
				description:
					'User first name to find and filter tasks by that user (optional, requires lastName)',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['searchTasks'],
					},
				},
				description:
					'User last name to find and filter tasks by that user (optional, requires firstName)',
			},
			{
				displayName: 'Organization ID',
				name: 'orgId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['searchTasks'],
					},
				},
				description:
					'Filter by organization ID - shows tasks linked to this organization (optional)',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['searchTasks'],
					},
				},
				description: 'Maximum number of results (optional, max 100, default 50)',
			},
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['tasks'],
						operation: ['markTaskCompleted'],
					},
				},
				description: 'Task ID to mark as completed (required)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['timesheets'],
					},
				},
				options: [
					{
						name: 'Get Timesheet',
						value: 'getTimesheet',
						description:
							'Get timesheet data for users within a date range. Returns detailed clock-in information grouped by user and date with total time logged, start/end times, and individual clock-in logs.',
						action: 'Get Timesheet',
					},
				],
				default: 'getTimesheet',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['timesheets'],
						operation: ['getTimesheet'],
					},
				},
				description: 'Start date for timesheet data in YYYY-MM-DD format (required)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['timesheets'],
						operation: ['getTimesheet'],
					},
				},
				description: 'End date for timesheet data in YYYY-MM-DD format (required)',
			},
			{
				displayName: 'User IDs',
				name: 'userIds',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['timesheets'],
						operation: ['getTimesheet'],
					},
				},
				description:
					'String of user IDs Qoma seperated to include in timesheet (Example 123,122,222) (optional - if not provided, returns data for all users who have clock-ins in the date range)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['transactions'],
					},
				},
				options: [
					{
						name: 'Refund Transaction',
						value: 'refundTransaction',
						description:
							'Process a refund for a transaction using the OrganizationController postRefundPayment method. Creates a refund invoice and processes the refund through payment integrations.',
						action: 'Refund Transaction',
					},
				],
				default: 'refundTransaction',
			},
			{
				displayName: 'Transaction ID',
				name: 'transactionId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['transactions'],
						operation: ['refundTransaction'],
					},
				},
				description:
					'Transaction ID to refund (required) - use getTransactions to find valid transaction IDs',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['transactions'],
						operation: ['refundTransaction'],
					},
				},
				description:
					'Refund amount - must be greater than 0 and not exceed transaction amount (required)',
			},
			{
				displayName: 'Sales Tax',
				name: 'salesTax',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['transactions'],
						operation: ['refundTransaction'],
					},
				},
				description: 'Sales tax information for refund processing (optional)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get My Data',
						value: 'getMyData',
						description:
							'Retrieve comprehensive data for the authenticated user including subscriptions, deals, tasks, checklists, support tickets, and projects. Returns all items assigned to or owned by the current user with optional filtering. By default, only returns items created after January 1st 2025.',
						action: 'Get My Data',
					},
				],
				default: 'getMyData',
			},
			{
				displayName: 'Subscription Board',
				name: 'subscriptionBoard',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getMyData'],
					},
				},
				description: 'Filter subscription items by board name (optional)',
			},
			{
				displayName: 'Subscription Filter',
				name: 'subscriptionFilter',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getMyData'],
					},
				},
				description:
					'Filter subscriptions by status: Active, Pending, Overdue, Delivered (optional, default: Active)',
			},
			{
				displayName: 'Deal Board',
				name: 'dealBoard',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getMyData'],
					},
				},
				description: 'Filter deals by board name (optional)',
			},
			{
				displayName: 'Deal Filter',
				name: 'dealFilter',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getMyData'],
					},
				},
				description:
					'Filter deals by status: in_progress, won, lost (optional, default: in_progress)',
			},
			{
				displayName: 'Task Status',
				name: 'taskStatus',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getMyData'],
					},
				},
				description:
					'Filter tasks by completion status: completed or incomplete (optional, default: incomplete)',
			},
			{
				displayName: 'Ticket Status',
				name: 'ticketStatus',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getMyData'],
					},
				},
				description:
					'Filter support tickets by status: replied, open, closed, spam, trash (optional, default: replied and open)',
			},
			{
				displayName: 'Project Status',
				name: 'projectStatus',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getMyData'],
					},
				},
				description:
					'Filter projects by status: Pending, Active, Completed, Cancelled, Overdue, Archived (optional, default: excludes Completed and Archived)',
			},
			{
				displayName: 'Enabled Old Data',
				name: 'enabledOldData',
				type: 'boolean',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getMyData'],
					},
				},
				description:
					'Boolean flag to include all data regardless of creation date (optional, default: false - filters to items created after 2025-01-01)',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['users'],
					},
				},
				options: [
					{
						name: 'Find Users or Staff',
						value: 'findUsers',
						description: 'Searches users or staff by name or email',
						action: 'Find Users or Staff',
					},
					{
						name: 'Get PTO',
						value: 'getPTO',
						description:
							'Retrieve PTO (Paid Time Off) information for a specific user. Returns detailed time-off data including balance, scheduled leaves, and employment duration.',
						action: 'Get PTO',
					},
				],
				default: 'findUsers',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['users'],
						operation: ['findUsers'],
					},
				},
				description: 'Search term (name or email)',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['users'],
						operation: ['findUsers'],
					},
				},
				description: 'Search type: name or email (default: name)',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['users'],
						operation: ['findUsers'],
					},
				},
				description: 'Filter by user role: admin, user, client, affiliate',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				required: false,
				displayOptions: {
					show: {
						resource: ['users'],
						operation: ['getPTO'],
					},
				},
				description: 'User ID to retrieve PTO information for (required)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: IDataObject[] = [];
		const operation = this.getNodeParameter('operation', 0);

		const nodeParams = this.getNode().parameters;
		const evaluatedParams: { [key: string]: any } = {};

		for (const key of Object.keys(nodeParams)) {
			if (key === 'resource' || key === 'operation' || key == 'authentication') continue;
			const value = this.getNodeParameter(key, 0);
			if (isEmpty(value)) continue;
			evaluatedParams[key] = value;
		}
		let body: IDataObject = { action: operation, ...evaluatedParams };

		const responseData = await gcApiRequest.call(this, body);

		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData.data as IDataObject[]),
			{ itemData: { item: 0 } },
		);

		returnData.push(...executionData);

		return [returnData as INodeExecutionData[]];
	}
}
