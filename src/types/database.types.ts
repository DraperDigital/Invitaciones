export type Profile = {
    id: string;
    email: string | null;
    full_name: string | null;
    created_at: string;
};

export type Event = {
    id: string;
    user_id: string;
    title: string;
    event_type: 'wedding' | 'xv' | 'birthday' | 'bautizo' | 'graduacion' | 'comunion' | 'corporate' | 'other';
    date_time: string;
    venue_name: string | null;
    venue_address: string | null;
    maps_link: string | null;
    dress_code: string | null;
    rsvp_deadline: string | null;
    is_published: boolean;
    theme_config: any; // JSONB
    slug: string | null;
    plan: string | null;
    created_at: string;
};

export type Guest = {
    id: string;
    event_id: string;
    name: string;
    phone: string | null;
    email: string | null;
    group_name: string | null;
    guest_token: string;
    max_plus_ones: number;
    status: 'pending' | 'sent' | 'viewed' | 'confirmed' | 'declined';
    views_count: number;
    table_id: string | null;
    last_reminder_at: string | null;
    invitation_sent_at: string | null;
    checked_in_at: string | null;
    created_at: string;
};

export type EventTable = {
    id: string;
    event_id: string;
    name: string;
    capacity: number;
    created_at: string;
};

export type RSVP = {
    id: string;
    event_id: string;
    guest_id: string;
    status: 'yes' | 'no' | 'maybe';
    plus_ones_confirmed: number;
    dietary_restrictions: string | null;
    message: string | null;
    created_at: string;
};

export type Plan = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    price_mxn: number;
    billing_type: 'one_time' | 'custom_quote';
    is_active: boolean;
};

export type Feature = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    category: string | null;
    ui_group: string | null;
    is_active: boolean;
};

export type FeatureAccessResponse = {
    plan: {
        code: string;
        name: string;
    };
    features: Array<{
        code: string;
        name: string;
        ui_group: string;
        status: 'enabled' | 'locked' | 'limited';
        upgrade_plan?: string;
    }>;
};
