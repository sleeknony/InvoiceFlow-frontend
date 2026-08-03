<Row>

    <Col md={3}>
        <StatCard
            title="Outstanding"
            value={data.outstanding}
        />
    </Col>

    <Col md={3}>
        <StatCard
            title="Overdue"
            value={data.overdue}
        />
    </Col>

    <Col md={3}>
        <StatCard
            title="Collected"
            value={
                data.collectedThisMonth
            }
        />
    </Col>

    <Col md={3}>
        <StatCard
            title="Unpaid Invoices"
            value={
                data.unpaidInvoices
            }
        />
    </Col>

</Row>